import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:9000',
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      
      // Add auth token if available in localStorage - check for both user and admin tokens
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      
      // Use the endpoint name to determine which token to use instead of a custom header
      if (adminToken && endpoint.startsWith('admin')) {
        headers.set('Authorization', `Bearer ${adminToken}`);
        console.log('Using admin token for admin endpoint:', endpoint);
      } else if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('Using user token for endpoint:', endpoint);
      }
      
      console.log('Using Base URL:', import.meta.env.VITE_BASE_URL || 'http://localhost:9000');
      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions", "Pots", "User", "Rewards", "Notifications", "AdminData"],
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

    // Notifications endpoints
    getNotifications: build.query({
      query: () => "rewards/notifications",
      providesTags: ["Notifications"],
      transformResponse: (response) => {
        console.log('Notifications Response:', response);
        return response;
      },
    }),
    
    markNotificationsRead: build.mutation({
      query: (data) => ({
        url: "rewards/notifications/read",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
    
    // Pot reward connection
    getPotReward: build.mutation({
      query: (data) => ({
        url: "rewards/pot-reward",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Rewards", "User"],
    }),

    // New Admin endpoints
    adminLogin: build.mutation({
      query: (credentials) => {
        console.log('Admin login attempt with:', credentials);
        return {
          url: 'admin/login',
          method: 'POST',
          body: credentials,
        };
      },
      transformResponse: (response) => {
        console.log('Admin Login Success Response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('Admin Login Error:', error);
        return error;
      },
    }),
    
    getAllUsers: build.query({
      query: () => "admin/users",
      providesTags: ["AdminData"],
    }),
    
    getUserDetails: build.query({
      query: (userId) => `admin/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "AdminData", id: userId }],
    }),
    
    getSystemStats: build.query({
      query: () => "admin/stats",
      providesTags: ["AdminData"],
    }),
    
    getTransactionsStats: build.query({
      query: () => "admin/transactions-stats",
      providesTags: ["AdminData"],
    }),
    
    getActiveUsers: build.query({
      query: () => "admin/active-users",
      providesTags: ["AdminData"],
    }),
    
    getFlaggedTransactions: build.query({
      query: () => "admin/flagged-transactions",
      providesTags: ["AdminData"],
    }),
    
    getPotStatistics: build.query({
      query: () => "admin/pot-statistics",
      providesTags: ["AdminData"],
    }),
    
    // Admin actions
    toggleUserStatus: build.mutation({
      query: ({ userId, status }) => ({
        url: `admin/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AdminData"],
    }),
    
    addSystemAlert: build.mutation({
      query: (alertData) => ({
        url: "admin/alerts",
        method: "POST",
        body: alertData,
      }),
      invalidatesTags: ["AdminData"],
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
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetPotRewardMutation,
  
  // Export the admin hooks
  useAdminLoginMutation,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useGetSystemStatsQuery,
  useGetTransactionsStatsQuery,
  useGetActiveUsersQuery,
  useGetFlaggedTransactionsQuery,
  useGetPotStatisticsQuery,
  useToggleUserStatusMutation,
  useAddSystemAlertMutation,
} = api;