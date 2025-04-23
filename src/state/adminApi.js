import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config/apiConfig';

// Define a safe invalidation helper function
const safeInvalidatesTags = (tags) => {
  // Ensure we always return a valid array of tag objects
  return Array.isArray(tags) ? tags.map(tag => 
    typeof tag === 'string' ? { type: tag } : tag
  ) : [];
};

export const adminApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: 'adminApi',
  tagTypes: [
    'AdminStats',
    'AdminUsers',
    'AdminTransactions',
    'AdminTickets',
    'FlaggedTransactions',
    'PotStats',
  ],
  endpoints: (build) => ({
    adminLogin: build.mutation({
      query: (credentials) => ({
        url: `/user/admin/login`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: safeInvalidatesTags([]),
    }),
    getUsers: build.query({
      query: () => ({
        url: "user/all-users",
        method: 'GET',
      }),
      providesTags: ["AdminUsers"],
      transformResponse: (response) => {
        if (!response.success || !response.users) return [];
        return response.users.map(user => ({
          ...user,
          id: user._id || user.id,
          status: user.status || 'active',
          balance: user.bankBalance || 0
        }));
      }
    }),

    getUserById: build.query({
      query: (userId) => `user/${userId}`,
      providesTags: (result, error, id) => [{ type: "AdminUsers", id }],
    }),
    
    updateUserStatus: build.mutation({
      query: ({ userId, status }) => ({
        url: `user/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: safeInvalidatesTags(["AdminUsers", "AdminStats"]),
    }),
    
    getTransactions: build.query({
      query: () => ({
        url: "transaction/transactions",
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (!Array.isArray(response)) return [];
        return response.map(tx => ({
          ...tx,
          amount: parseFloat(tx.amount) || 0,
          date: tx.date || tx.createdAt
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      providesTags: ["AdminTransactions"],
    }),
    
    getTransactionStats: build.query({
      query: () => ({
        url: "transaction/transactions",
        method: 'GET'
      }),
      providesTags: ["AdminTransactions"],
      transformResponse: (response) => {
        if (!Array.isArray(response) || response.length === 0) {
          return {
            totalTransactions: 0,
            totalVolume: 0,
            transactionGrowthRate: 0,
            volumeGrowthRate: 0,
            recentTransactions: [],
            volumeByMonth: Array(6).fill(0).map((_, i) => ({
              month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
              volume: 0
            }))
          };
        }

        const totalTransactions = response.length;
        const totalVolume = response.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

        const volumeByMonth = response
          .filter(tx => {
            const txDate = new Date(tx.date || tx.createdAt);
            return txDate >= sixMonthsAgo && txDate <= currentDate;
          })
          .reduce((acc, tx) => {
            const txDate = new Date(tx.date || tx.createdAt);
            const monthName = monthNames[txDate.getMonth()];
            acc[monthName] = (acc[monthName] || 0) + (parseFloat(tx.amount) || 0);
            return acc;
          }, {});

        const formattedVolumeByMonth = monthNames
          .slice(0, 6)
          .map(month => ({
            month,
            volume: volumeByMonth[month] || 0
          }));

        return {
          totalTransactions,
          totalVolume,
          transactionGrowthRate: 0,
          volumeGrowthRate: 0,
          recentTransactions: response.slice(0, 10),
          volumeByMonth: formattedVolumeByMonth
        };
      },
    }),
    
    getFlaggedTransactions: build.query({
      query: () => "transaction/transactions",
      providesTags: ["FlaggedTransactions"],
      transformResponse: (response) => {
        console.log('Processing transactions for flagged items:', response);
        if (!Array.isArray(response) || response.length === 0) return [];
        
        const sortedByAmount = [...response].sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0));
        const topPercentile = Math.max(1, Math.floor(sortedByAmount.length * 0.05));
        
        return sortedByAmount.slice(0, topPercentile).map(tx => ({
          id: tx._id || tx.id,
          date: tx.date || tx.createdAt,
          amount: parseFloat(tx.amount) || 0,
          userId: tx.senderId || tx.userId,
          reason: 'High transaction amount'
        }));
      },
    }),
    
    getPotStats: build.query({
      query: () => ({
        url: "pots",
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ["PotStats"],
      transformResponse: (response) => {
        console.log('Processing pot data:', response);
        
        if (!Array.isArray(response) || response.length === 0) {
          return {
            totalPots: 0,
            totalSavings: 0,
            potGrowthRate: 0,
            recentlyCreatedPots: 0
          };
        }
        
        const totalPots = response.length;
        const totalSavings = response.reduce((sum, pot) => sum + (parseFloat(pot.balance) || 0), 0);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentlyCreatedPots = response.filter(pot => {
          const creationDate = new Date(pot.createdAt);
          return creationDate >= oneWeekAgo;
        }).length;
        
        return {
          totalPots,
          totalSavings,
          potGrowthRate: totalPots > 0 ? (recentlyCreatedPots / totalPots) * 100 : 0,
          recentlyCreatedPots
        };
      },
      transformErrorResponse: (error) => {
        console.error('Error fetching pot stats:', error);
        return {
          totalPots: 0,
          totalSavings: 0,
          potGrowthRate: 0,
          recentlyCreatedPots: 0
        };
      },
    }),
    
    getTickets: build.query({
      query: () => ({
        url: "tickets",
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map(ticket => ({
            id: ticket._id?.$oid || ticket._id,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status || 'new',
            priority: ticket.priority,
            category: ticket.category,
            userId: ticket.userId?.$oid || ticket.userId,
            assignedTo: ticket.assignedTo,
            createdAt: ticket.createdAt?.$date || ticket.createdAt,
            updatedAt: ticket.updatedAt?.$date || ticket.updatedAt,
            messages: ticket.messages?.map(msg => ({
              id: msg._id?.$oid || msg._id,
              content: msg.content,
              userId: msg.userId?.$oid || msg.userId,
              isAdmin: msg.isAdmin,
              createdAt: msg.createdAt?.$date || msg.createdAt,
              updatedAt: msg.updatedAt?.$date || msg.updatedAt
            })) || []
          }));
        }
        return [];
      },
      providesTags: ["AdminTickets"],
    }),

    getTicketById: build.query({
      query: (ticketId) => `tickets/${ticketId}`,
      providesTags: (result, error, id) => [{ type: "AdminTickets", id }],
      transformErrorResponse: (error) => {
        console.error('Error fetching ticket details:', error);
        return null;
      }
    }),
    
    updateTicketStatus: build.mutation({
      query: ({ ticketId, status }) => ({
        url: `tickets/${ticketId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: safeInvalidatesTags(["AdminTickets"]),
    }),

    replyToTicket: build.mutation({
      query: ({ ticketId, message }) => ({
        url: `tickets/${ticketId}/messages`,
        method: 'POST',
        body: { content: message },
      }),
      invalidatesTags: safeInvalidatesTags(["AdminTickets"]),
    }),
    
    getAdminStats: build.query({
      query: () => ({
        url: "user/admin/stats",
        method: 'GET',
      }),
      providesTags: ["AdminStats"],
      transformResponse: (response) => {
        if (!response.success) return null;
        return response.stats;
      }
    }),

    getAdminDashboardData: build.query({
      query: () => "transaction/transactions",
      providesTags: ["AdminStats", "AdminUsers", "AdminTransactions", "PotStats"],
      transformResponse: (transactions, meta, arg) => {
        console.log('Processing admin dashboard data from transactions');
        
        if (!Array.isArray(transactions) || transactions.length === 0) {
          return {
            stats: { totalUsers: 0, activeUsers: 0, inactiveUsers: 0, blockedUsers: 0, 
                    newUsers: 0, userGrowthRate: 0, openTickets: 0, ticketGrowthRate: 0, 
                    ticketResponseRate: 0 },
            transactionStats: { totalTransactions: 0, totalVolume: 0, transactionGrowthRate: 0,
                              volumeGrowthRate: 0, recentTransactions: [], volumeByMonth: [] },
            potStats: { totalPots: 0, totalSavings: 0, potGrowthRate: 0, recentlyCreatedPots: 0 },
            flaggedTransactions: []
          };
        }
        
        const userSet = new Set();
        transactions.forEach(tx => {
          if (tx.senderId) userSet.add(tx.senderId);
          if (tx.receiverId) userSet.add(tx.receiverId);
        });
        const uniqueUsers = userSet.size;
        
        const totalTransactions = transactions.length;
        const totalVolume = transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
        
        const months = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        transactions.forEach(tx => {
          if (!tx.date && !tx.createdAt) return;
          
          const date = new Date(tx.date || tx.createdAt);
          const monthIndex = date.getMonth();
          const monthName = monthNames[monthIndex];
          
          if (!months[monthName]) {
            months[monthName] = 0;
          }
          
          months[monthName] += parseFloat(tx.amount) || 0;
        });
        
        const volumeByMonth = monthNames
          .map(month => ({ month, volume: months[month] || 0 }))
          .filter((_, index) => index < 6);
        
        const recentTransactions = [...transactions]
          .sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt || 0);
            const dateB = new Date(b.date || b.createdAt || 0);
            return dateB - dateA;
          })
          .slice(0, 10);
        
        const sortedByAmount = [...transactions].sort((a, b) => 
          (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0)
        );
        const topPercentile = Math.max(1, Math.floor(sortedByAmount.length * 0.05));
        
        const flaggedTransactions = sortedByAmount.slice(0, topPercentile).map(tx => ({
          id: tx._id || tx.id,
          date: tx.date || tx.createdAt,
          amount: parseFloat(tx.amount) || 0,
          userId: tx.senderId || tx.userId,
          reason: 'High transaction amount'
        }));
        
        return {
          stats: {
            totalUsers: uniqueUsers,
            activeUsers: uniqueUsers, 
            inactiveUsers: 0,
            blockedUsers: 0,
            newUsers: Math.round(uniqueUsers * 0.15),
            userGrowthRate: Math.round((Math.round(uniqueUsers * 0.15) / uniqueUsers) * 100) || 0,
            openTickets: 0,
            ticketGrowthRate: 0,
            ticketResponseRate: 0
          },
          transactionStats: {
            totalTransactions,
            totalVolume,
            transactionGrowthRate: 0,
            volumeGrowthRate: 0,
            recentTransactions,
            volumeByMonth
          },
          potStats: {
            totalPots: 0,
            totalSavings: 0,
            potGrowthRate: 0,
            recentlyCreatedPots: 0
          },
          flaggedTransactions
        };
      },
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
  useGetFlaggedTransactionsQuery,
  useGetPotStatsQuery,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketStatusMutation,
  useReplyToTicketMutation,
  useGetAdminDashboardDataQuery
} = adminApi;
