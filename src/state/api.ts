import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      console.log('Request URL:', import.meta.env.VITE_BASE_URL);
      console.log('Request Headers:', Object.fromEntries(headers));
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => {
        const url = "kpi/kpis";
        console.log('Fetching KPIs from:', import.meta.env.VITE_BASE_URL + url);
        return url;
      },
      transformResponse: (response: unknown): GetKpisResponse[] => {
        console.log('KPIs Response:', response);
        return response as GetKpisResponse[];
      },
      transformErrorResponse: (error) => {
        console.error('KPIs Error:', error);
        return error;
      },
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } =
  api;
