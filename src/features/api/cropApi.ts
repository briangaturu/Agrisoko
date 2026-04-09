import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: baseQueryWithReauth,
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