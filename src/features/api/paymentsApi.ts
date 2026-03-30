import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
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

   //mpesa
initiateMpesaPayment: builder.mutation({
  query: (payload) => ({
    url: "/payments/mpesa/stk",
    method: "POST",
    body: payload, // { phone, amount, orderId }
  }),
}),

    // CREATE STRIPE PAYMENT INTENT ✅
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