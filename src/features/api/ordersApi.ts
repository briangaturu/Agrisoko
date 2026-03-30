import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    // GET ALL ORDERS
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["orders"],
    }),

    // GET ORDER BY ID
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["orders"],
    }),

    // GET ORDERS BY BUYER
    getOrdersByBuyer: builder.query({
      query: (buyerId) => `/orders/buyer/${buyerId}`,
      providesTags: ["orders"],
    }),

    // CREATE ORDER
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders",
        method: "POST",
        body: payload, // { buyerId, totalAmount, items: [{ listingId, quantity, price }] }
      }),
      invalidatesTags: ["orders"],
    }),

    // UPDATE ORDER
    updateOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["orders"],
    }),

    // DELETE ORDER
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersByBuyerQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;