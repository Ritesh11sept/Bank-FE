import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:9000',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      
      // Add auth token if available in localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      console.log('Using Base URL:', import.meta.env.VITE_BASE_URL || 'http://localhost:9000');
      console.log('Request Headers:', Object.fromEntries(headers));
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions", "Pots", "User", "Rewards"],
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

    // Authentication endpoints
    registerUser: build.mutation({
      query: (userData) => {
        console.log('Register endpoint called with:', userData);
        return {
          url: 'user/register',
          method: 'POST',
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),
    
    verifyOTP: build.mutation({
      query: (otpData) => ({
        url: 'user/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    
    extractPANDetails: build.mutation({
      query: (imageData) => ({
        url: 'user/extract-pan-details',
        method: 'POST',
        body: imageData,
      }),
    }),
    
    loginUser: build.mutation({
      query: (credentials) => ({
        url: 'user/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    
    getLinkedAccounts: build.mutation({
      query: (panData) => ({
        url: 'user/getLinkedAccounts',
        method: 'POST',
        body: panData,
      }),
    }),

    // User profile endpoint
    getUserProfile: build.query({
      query: () => "user/profile",
      providesTags: ["User"],
      transformResponse: (response) => {
        console.log('User Profile Response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('User Profile Error:', error);
        return error;
      },
    }),

    // Rewards endpoints
    getUserRewards: build.query({
      query: () => "rewards",
      providesTags: ["Rewards"],
    }),
    
    updateLoginStreak: build.mutation({
      query: () => ({
        url: "rewards/login-streak",
        method: "POST",
      }),
      invalidatesTags: ["Rewards", "User"],
    }),
    
    revealScratchCard: build.mutation({
      query: (cardId) => ({
        url: `rewards/scratch-card/${cardId}`,
        method: "POST",
      }),
      invalidatesTags: ["Rewards", "User"],
    }),
    
    submitGameScore: build.mutation({
      query: (scoreData) => ({
        url: "rewards/game-score",
        method: "POST",
        body: scoreData,
      }),
      invalidatesTags: ["Rewards", "User"],
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
  useRegisterUserMutation,
  useVerifyOTPMutation,
  useExtractPANDetailsMutation,
  useLoginUserMutation,
  useGetLinkedAccountsMutation,
  useGetUserProfileQuery, // Export the new hook
  useGetUserRewardsQuery,
  useUpdateLoginStreakMutation,
  useRevealScratchCardMutation,
  useSubmitGameScoreMutation,
} = api;
