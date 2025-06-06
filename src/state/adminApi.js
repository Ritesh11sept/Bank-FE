import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Token validation helper - Made more lenient
const isValidToken = (token) => {
  return token && (token.startsWith('Bearer ') || token.includes('mock-admin-token'));
};

// Base query with auth handling
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:9000',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Ensure Bearer prefix for admin token
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers.set('authorization', authToken);
      console.log('Setting admin auth header:', authToken);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query with retry logic and better error handling
const baseQueryWithRetry = async (args, api, extraOptions) => {
  try {
    // Log the endpoint being called for debugging
    console.log('Calling API endpoint:', args.url);
    
    const result = await baseQueryWithAuth(args, api, extraOptions);
    
    // Log the response status for debugging
    console.log('API response status:', result?.meta?.response?.status);
    
    if (result.error) {
      console.error('API error:', result.error);
      
      // Check for auth errors that might need token refresh
      if (result.error.status === 401 || result.error.status === 403) {
        // If this is an auth-related failure, log more details
        console.error('Auth error details:', result.error);
        
        // Could implement token refresh logic here if needed
      }
    }
    
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "AdminStats", "AdminUsers", "AdminTransactions", "AdminTickets", 
    "FlaggedTransactions", "PotStats"
  ],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      async queryFn(credentials, _queryApi, _extraOptions, fetchWithBQ) {
        // Check for hardcoded admin credentials first
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const mockResponse = {
            data: {
              token: 'Bearer mock-admin-token-' + Date.now(),
              user: {
                id: 'admin-1',
                username: 'admin',
                role: 'admin',
              }
            }
          };

          // Store admin data in localStorage
          localStorage.setItem('adminToken', mockResponse.data.token);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminUser', JSON.stringify(mockResponse.data.user));

          return mockResponse;
        }

        // If not admin credentials, try real API call
        const result = await fetchWithBQ({
          url: 'user/login',
          method: 'POST',
          body: credentials,
        });

        return result;
      },
    }),
    
    getUsers: builder.query({
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

    getUserById: builder.query({
      query: (userId) => `user/${userId}`,
      providesTags: (result, error, id) => [{ type: "AdminUsers", id }],
    }),
    
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `user/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),
    
    getTransactions: builder.query({
      query: () => ({
        url: "transaction/transactions",
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (!Array.isArray(response)) return [];
        // Return all transactions sorted by date
        return response.map(tx => ({
          ...tx,
          amount: parseFloat(tx.amount) || 0,
          date: tx.date || tx.createdAt
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      providesTags: ["AdminTransactions"],
    }),
    
    getTransactionStats: builder.query({
      query: () => ({
        url: "transaction/transactions",
        method: 'GET'
      }),
      providesTags: ["AdminTransactions"],
      transformResponse: (response) => {
        if (!Array.isArray(response) || response.length === 0) {
          // Return default structure for empty response
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

        // Process all transactions
        const totalTransactions = response.length;
        const totalVolume = response.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

        // Calculate last 6 months volume
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

        // Initialize monthly volumes
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

        // Format into required structure
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
    
    getFlaggedTransactions: builder.query({
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
    
    getPotStats: builder.query({
      query: () => ({
        url: "pots",
        method: 'GET',
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
    
    getTickets: builder.query({
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

    getTicketById: builder.query({
      query: (ticketId) => `tickets/${ticketId}`, // Updated path format
      providesTags: (result, error, id) => [{ type: "AdminTickets", id }],
      transformErrorResponse: (error) => {
        console.error('Error fetching ticket details:', error);
        return null;
      }
    }),
    
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `tickets/${ticketId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ["AdminTickets"],
    }),

    replyToTicket: builder.mutation({
      query: ({ ticketId, message }) => ({
        url: `tickets/${ticketId}/messages`,
        method: 'POST',
        body: { content: message },
        // Make sure to include response body logging for debugging
        responseHandler: (response) => {
          console.log('Ticket reply response status:', response.status);
          
          // For non-JSON responses or errors, handle them gracefully
          return response.text().then(text => {
            if (!text) return {};
            
            try {
              return JSON.parse(text);
            } catch (e) {
              console.error('Error parsing response:', e);
              return { content: message, error: true, rawResponse: text };
            }
          });
        },
        // Add error handling with more detailed logging
        validateStatus: (response, result) => {
          console.log('Validation status:', response.status, 'Response:', result);
          // Accept 2xx status codes as success
          return response.status >= 200 && response.status < 300;
        },
      }),
      // Ensure invalidation of the correct tags
      invalidatesTags: (result, error, { ticketId }) => {
        console.log('Invalidating tags for ticket:', ticketId);
        return [
          "AdminTickets", 
          { type: "AdminTickets", id: ticketId }
        ];
      },
      // Transform the response to ensure consistent format even with errors
      transformResponse: (response, meta, arg) => {
        if (response?.error) {
          console.log('Transforming error response:', response);
          // Return a standardized message object even for errors
          return {
            id: `temp-${Date.now()}`,
            content: arg.message,
            isAdmin: true,
            createdAt: new Date().toISOString(),
            clientSide: true // Flag to indicate this was created client-side
          };
        }
        return response;
      },
      // Add error handling for the mutation
      onError: (error, { ticketId, message }, { rejectWithValue }) => {
        console.error(`Failed to reply to ticket ${ticketId}:`, error);
        
        // Return a formatted response with the message content
        // This allows the UI to still show the message even if the server request failed
        return rejectWithValue({
          id: `temp-${Date.now()}`,
          content: message,
          isAdmin: true,
          createdAt: new Date().toISOString(),
          error: true,
          errorMessage: error.message || 'Failed to send message'
        });
      }
    }),

    getAdminStats: builder.query({
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

    getAdminDashboardData: builder.query({
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
