import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "../auth/authSlice";

// Create a base query with automatic token handling
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("authorization", `Bearer ${token}`);
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Enhanced base query with automatic logout on 401
export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired or invalid - logout user
    api.dispatch(clearCredentials());

    // Clear any cached data
    localStorage.removeItem("token");

    // Optional: redirect to login (if not already handled by auth slice)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return result;
};