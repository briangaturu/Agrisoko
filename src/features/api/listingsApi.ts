import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const listingsApi = createApi({
  reducerPath: "listingsApi",
  baseQuery: baseQueryWithReauth,
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
