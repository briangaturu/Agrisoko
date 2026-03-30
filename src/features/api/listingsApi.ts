import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listingsApi = createApi({
  reducerPath: "listingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["listings"],
  endpoints: (builder) => ({
    // ✅ LISTINGS

    // GET ALL LISTINGS
    getListings: builder.query({
      query: () => "/listings",
      providesTags: ["listings"],
    }),

    // GET LISTING BY ID
    getListingById: builder.query({
      query: (id) => `/listings/${id}`,
      providesTags: ["listings"],
    }),

    // CREATE LISTING
    createListing: builder.mutation({
      query: (payload) => ({
        url: "/listings",
        method: "POST",
        body: payload, // { farmerId, cropId, pricePerUnit, quantityAvailable, description, location, status }
      }),
      invalidatesTags: ["listings"],
    }),

    // UPDATE LISTING
    updateListing: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/listings/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["listings"],
    }),

    // DELETE LISTING
    deleteListing: builder.mutation({
      query: (id) => ({
        url: `/listings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["listings"],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingByIdQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
} = listingsApi;
