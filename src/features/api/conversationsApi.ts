import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["conversations", "messages"],
  endpoints: (builder) => ({
    // Conversations
    startConversation: builder.mutation({
      query: (payload) => ({
        url: "/conversations/start",
        method: "POST",
        body: payload, // { userAId, userBId }
      }),
      invalidatesTags: ["conversations"],
    }),

    getConversationsByUser: builder.query({
      query: (userId) => `/conversations/user/${userId}`,
      providesTags: ["conversations"],
    }),

    getConversationById: builder.query({
      query: (conversationId) => `/conversations/${conversationId}`,
      providesTags: ["conversations"],
    }),

    // Messages
    getConversationMessages: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: ["messages"],
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, ...payload }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: payload, // { senderId, content }
      }),
      invalidatesTags: ["messages"],
    }),

    markConversationRead: builder.mutation({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/read`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["conversations", "messages"],
    }),
  }),
});

export const {
  useStartConversationMutation,
  useGetConversationsByUserQuery,
  useGetConversationByIdQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} = conversationsApi;
