import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    // ✅ AUTH
    registerUser: builder.mutation({
      query: (registerPayload) => ({
        url: "/auth/register",
        method: "POST",
        body: registerPayload, // { fullName, email, phone, password, role }
      }),
    }),

    loginUser: builder.mutation({
      query: (loginPayload) => ({
        url: "/auth/login",
        method: "POST",
        body: loginPayload, // { email, password }
      }),
    }),

    passwordReset: builder.mutation({
      query: (payload) => ({
        url: "/auth/password-reset",
        method: "POST",
        body: payload, // { email }
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: "PUT",
        body: { password }, // ✅ must be lowercase "password"
      }),
    }),

    // ✅ USERS
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["users"],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: payload, // { fullName, email, phone }
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  usePasswordResetMutation,
  useResetPasswordMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi;