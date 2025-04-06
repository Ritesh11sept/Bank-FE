import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:9000',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      console.log('Request URL:', import.meta.env.VITE_BASE_URL);
      console.log('Request Headers:', Object.fromEntries(headers));
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions", "Pots"],
  endpoints: (build) => ({
    getKpis: build.query({
      query: () => {
        const url = "kpi/kpis";
        console.log('Fetching KPIs from:', import.meta.env.VITE_BASE_URL + url);
        return url;
      },
      transformResponse: (response) => {
        console.log('KPIs Response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('KPIs Error:', error);
        return error;
      },
      providesTags: ["Kpis"],
    }),
    getProducts: build.query({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),

    // Pots endpoints
    getPots: build.query({
      query: () => "pots",
      providesTags: ["Pots"],
      transformErrorResponse: (response) => 
        response.data?.message || 'Failed to load pots',
    }),
    
    createPot: build.mutation({
      query: (pot) => ({
        url: "pots",
        method: "POST",
        body: pot,
      }),
      invalidatesTags: ["Pots"],
    }),
    
    depositToPot: build.mutation({
      query: ({ id, amount }) => ({
        url: `pots/${id}/deposit`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Pots"],
    }),
    
    withdrawFromPot: build.mutation({
      query: ({ id, amount }) => ({
        url: `pots/${id}/withdraw`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Pots"],
    }),
    
    updatePotGoal: build.mutation({
      query: ({ potId, data }) => ({
        url: `/pots/${potId}/goal`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pots"],
    }),
    
    deletePot: build.mutation({
      query: (id) => ({
        url: `pots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pots"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useGetPotsQuery,
  useCreatePotMutation,
  useDepositToPotMutation,
  useWithdrawFromPotMutation,
  useUpdatePotGoalMutation,
  useDeletePotMutation,
} = api;
