import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (userId) => `/notifications/${userId}`,
      providesTags: ["notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: (userId) => ({
        url: `/notifications/${userId}/read-all`,
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;