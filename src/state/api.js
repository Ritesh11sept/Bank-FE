import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Determine environment
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
const API_BASE_URL = isProduction
  ? 'https://financeseerbe.vercel.app'
  : 'http://localhost:9000';

console.log(`API using base URL: ${API_BASE_URL}`);

// Add this helper function to safely handle tag invalidation
const safeInvalidatesTags = (tags) => {
  if (!tags) return [];
  return Array.isArray(tags) ? tags.map(tag => 
    typeof tag === 'string' ? { type: tag } : tag
  ) : [];
};

// Create API with fixed configuration to prevent invalidatesTags errors
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: [
    'User',
    'Transactions',
    'Pots',
    'Stats',
    'Rewards',
    'Tickets',
    'Products',
  ],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: builder.query({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),

    getPots: builder.query({
      query: () => "pots",
      providesTags: ["Pots"],
      transformErrorResponse: (response) =>
        response.data?.message || 'Failed to load pots',
    }),

    createPot: builder.mutation({
      query: (pot) => ({
        url: "pots",
        method: "POST",
        body: pot,
      }),
      invalidatesTags: safeInvalidatesTags(["Pots"]),
    }),

    depositToPot: builder.mutation({
      query: ({ id, amount }) => ({
        url: `pots/${id}/deposit`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: safeInvalidatesTags(["Pots"]),
    }),

    withdrawFromPot: builder.mutation({
      query: ({ id, amount }) => ({
        url: `pots/${id}/withdraw`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: safeInvalidatesTags(["Pots"]),
    }),

    updatePotGoal: builder.mutation({
      query: ({ potId, data }) => ({
        url: `/pots/${potId}/goal`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: safeInvalidatesTags(["Pots"]),
    }),

    deletePot: builder.mutation({
      query: (id) => ({
        url: `pots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: safeInvalidatesTags(["Pots"]),
    }),

    registerUser: builder.mutation({
      query: (userData) => {
        console.log('Register endpoint called with:', userData);
        return {
          url: 'user/register',
          method: 'POST',
          body: userData,
        };
      },
      invalidatesTags: safeInvalidatesTags(["User"]),
    }),

    verifyOTP: builder.mutation({
      query: (otpData) => ({
        url: 'user/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    extractPANDetails: builder.mutation({
      query: (imageData) => ({
        url: 'user/extract-pan-details',
        method: 'POST',
        body: imageData,
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => {
        console.log('Endpoint: loginUser');
        console.log('Request Headers:', headers => headers);
        return {
          url: '/user/login',
          method: 'POST',
          body: credentials,
        };
      },
    }),

    getLinkedAccounts: builder.mutation({
      query: (panData) => ({
        url: 'user/getLinkedAccounts',
        method: 'POST',
        body: panData,
      }),
    }),

    getUserProfile: builder.query({
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

    getUserRewards: builder.query({
      query: () => "rewards",
      providesTags: ["Rewards"],
    }),

    updateLoginStreak: builder.mutation({
      query: () => ({
        url: "rewards/login-streak",
        method: "POST",
      }),
      invalidatesTags: safeInvalidatesTags(["Rewards", "User"]),
    }),

    revealScratchCard: builder.mutation({
      query: (cardId) => ({
        url: `rewards/scratch-card/${cardId}`,
        method: "POST",
      }),
      invalidatesTags: safeInvalidatesTags(["Rewards", "User"]),
    }),

    submitGameScore: builder.mutation({
      query: (scoreData) => ({
        url: "rewards/game-score",
        method: "POST",
        body: scoreData,
      }),
      invalidatesTags: safeInvalidatesTags(["Rewards", "User"]),
    }),

    getNotifications: builder.query({
      query: () => "rewards/notifications",
      providesTags: ["Notifications"],
      transformResponse: (response) => {
        console.log('Notifications Response:', response);
        return response;
      },
    }),

    markNotificationsRead: builder.mutation({
      query: (data) => ({
        url: "rewards/notifications/read",
        method: "POST",
        body: data,
      }),
      invalidatesTags: safeInvalidatesTags(["Notifications"]),
    }),

    getPotReward: builder.mutation({
      query: (data) => ({
        url: "rewards/pot-reward",
        method: "POST",
        body: data,
      }),
      invalidatesTags: safeInvalidatesTags(["Rewards", "User"]),
    }),

    transferMoney: builder.mutation({
      query: (transferData) => ({
        url: "user/transfer",
        method: "POST",
        body: transferData,
      }),
      invalidatesTags: safeInvalidatesTags(["User", "Transactions"]),
    }),

    getUserTransactions: builder.query({
      query: () => "user/transactions",
      providesTags: ["Transactions"],
    }),

    getAllBankUsers: builder.query({
      query: () => "user/all-users",
      providesTags: ["User"],
    }),

    adminLogin: builder.mutation({
      query: (credentials) => {
        console.log('Admin login attempt with:', credentials);
        return {
          url: '/user/admin/login',
          method: 'POST',
          body: credentials,
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log('Admin Login Success Response:', data);

          if (data && data.token) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('isAdmin', 'true');
            if (data.admin) {
              localStorage.setItem('adminUser', JSON.stringify(data.admin));
            }
          }
        } catch (error) {
          console.error('Admin Login Error in onQueryStarted:', error);
        }
      },
    }),

    getAllUsers: builder.query({
      query: () => "admin/users",
      providesTags: ["AdminData", "Users"],
    }),

    getUserDetails: builder.query({
      query: (userId) => `admin/users/${userId}`,
      providesTags: (result, error, id) => safeInvalidatesTags([
        { type: "AdminData", id },
        { type: "User", id }
      ]),
    }),

    getSystemStats: builder.query({
      query: () => "admin/stats",
      providesTags: ["AdminData", "SystemStats"],
    }),

    getTransactionsStats: builder.query({
      query: () => "admin/transactions-stats",
      providesTags: ["AdminData", "TransactionStats"],
    }),

    getActiveUsers: builder.query({
      query: () => '/user/admin/active-users',
      providesTags: ['ActiveUsers'],
    }),

    getFlaggedTransactions: builder.query({
      query: () => "admin/flagged-transactions",
      providesTags: ["AdminData", "FlaggedTransactions"],
    }),

    getPotStatistics: builder.query({
      query: () => "admin/pot-statistics",
      providesTags: ["AdminData", "PotStats"],
    }),

    toggleUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `admin/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => safeInvalidatesTags([
        "AdminData",
        "Users",
        { type: "User", id: arg.userId }
      ]),
    }),

    addSystemAlert: builder.mutation({
      query: (alertData) => ({
        url: "admin/alerts",
        method: "POST",
        body: alertData,
      }),
      invalidatesTags: safeInvalidatesTags(["AdminData"]),
    }),

    getDetailedTransactions: builder.query({
      query: () => "transaction/detailed-transactions",
      providesTags: ["Transactions"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log('Starting detailed transactions query');
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No authentication token found');
          }
          await queryFulfilled;
        } catch (error) {
          console.error('Query failed:', error);
        }
      },
      transformResponse: (response) => {
        console.log('Detailed Transactions Raw Response:', response);

        if (!response || !Array.isArray(response) || response.length === 0) {
          console.log('No transactions found');
          return {
            transactions: [],
            incomeByMonth: {},
            expensesByMonth: {},
            categoriesByAmount: {},
            totalIncome: 0,
            totalExpenses: 0,
            recentTransactions: [],
            incomeByMonthArray: [],
            expensesByMonthArray: [],
            categoriesArray: [],
          };
        }

        const processedData = {
          transactions: response,
          incomeByMonth: {},
          expensesByMonth: {},
          categoriesByAmount: {},
          totalIncome: 0,
          totalExpenses: 0,
          recentTransactions: [],
        };

        const userId = localStorage.getItem('userId');
        console.log('Processing transactions for userId:', userId);

        const monthTotals = {};

        response.forEach(transaction => {
          try {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const monthYear = `${month} ${year}`;

            if (!monthTotals[monthYear]) {
              monthTotals[monthYear] = { income: 0, expense: 0 };
            }

            const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
            const senderId = String(transaction.senderId?.$oid || transaction.senderId);

            const isIncome = receiverId === userId;
            const isExpense = senderId === userId;

            const amount = transaction.amount;
            let category = 'other';

            if (transaction.note && typeof transaction.note === 'string') {
              category = transaction.note.toLowerCase().trim();
              if (category.includes(' ')) {
                category = category.split(' ')[0];
              }
            }

            if (isIncome) {
              processedData.totalIncome += amount;
              processedData.incomeByMonth[monthYear] = (processedData.incomeByMonth[monthYear] || 0) + amount;
              monthTotals[monthYear].income += amount;
            }

            if (isExpense) {
              processedData.totalExpenses += amount;
              processedData.expensesByMonth[monthYear] = (processedData.expensesByMonth[monthYear] || 0) + amount;
              monthTotals[monthYear].expense += amount;
              processedData.categoriesByAmount[category] = (processedData.categoriesByAmount[category] || 0) + amount;
            }

            processedData.recentTransactions.push(transaction);
          } catch (e) {
            console.error('Error processing transaction:', transaction, e);
          }
        });

        processedData.incomeByMonthArray = Object.entries(processedData.incomeByMonth).map(([month, value]) => ({
          month,
          value,
        }));
        processedData.expensesByMonthArray = Object.entries(processedData.expensesByMonth).map(([month, value]) => ({
          month,
          value,
        }));
        processedData.categoriesArray = Object.entries(processedData.categoriesByAmount).map(([category, value]) => ({
          category,
          value,
        }));

        return processedData;
      }
    }),
  }),
});

export const {
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
  useGetUserProfileQuery,
  useGetUserRewardsQuery,
  useUpdateLoginStreakMutation,
  useRevealScratchCardMutation,
  useSubmitGameScoreMutation,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetPotRewardMutation,
  useTransferMoneyMutation,
  useGetUserTransactionsQuery,
  useGetAllBankUsersQuery,
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
  useGetDetailedTransactionsQuery
} = api;
