import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["payments"],
  endpoints: (builder) => ({
    // GET ALL PAYMENTS
    getPayments: builder.query({
      query: () => "/payments",
      providesTags: ["payments"],
    }),

    // GET PAYMENT BY ID
    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
      providesTags: ["payments"],
    }),

    // GET PAYMENTS BY ORDER
    getPaymentsByOrder: builder.query({
      query: (orderId) => `/payments/order/${orderId}`,
      providesTags: ["payments"],
    }),

    // CREATE PAYMENT
    createPayment: builder.mutation({
      query: (payload) => ({
        url: "/payments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["payments"],
    }),

    // UPDATE PAYMENT
    updatePayment: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payments/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["payments"],
    }),

    // INITIATE MPESA STK PUSH
    // payload: { phone, amount, orderId, farmerPhone }
    initiateMpesaPayment: builder.mutation({
      query: (payload) => ({
        url: "/payments/mpesa/stk",
        method: "POST",
        body: payload,
      }),
    }),

    // CREATE STRIPE PAYMENT INTENT
    createStripeIntent: builder.mutation({
      query: (payload) => ({
        url: "/payments/stripe/intent",
        method: "POST",
        body: payload, // { amount, orderId }
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByOrderQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useInitiateMpesaPaymentMutation,
  useCreateStripeIntentMutation,
} = paymentsApi;