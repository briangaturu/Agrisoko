import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["crops"],
  endpoints: (builder) => ({
    // ✅ CROPS

    // GET ALL CROPS
    getCrops: builder.query({
      query: () => "/crops",
      providesTags: ["crops"],
    }),

    // GET CROP BY ID
    getCropById: builder.query({
      query: (id) => `/crops/${id}`,
      providesTags: ["crops"],
    }),

    // CREATE CROP
    createCrop: builder.mutation({
      query: (payload) => ({
        url: "/crops",
        method: "POST",
        body: payload, // { name, category, unit, cropUrl }
      }),
      invalidatesTags: ["crops"],
    }),

    // UPDATE CROP
    updateCrop: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/crops/${id}`,
        method: "PUT",
        body: payload, // { name?, category?, unit?, cropUrl? }
      }),
      invalidatesTags: ["crops"],
    }),

    // DELETE CROP
    deleteCrop: builder.mutation({
      query: (id) => ({
        url: `/crops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["crops"],
    }),
  }),
});

export const {
  useGetCropsQuery,
  useGetCropByIdQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
} = cropApi;