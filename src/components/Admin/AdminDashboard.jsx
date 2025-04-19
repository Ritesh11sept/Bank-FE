import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BarChart2, TicketCheck, LogOut, Search, Shield, Activity,
  TrendingUp, AlertCircle, DollarSign, UserCheck, Clock, ChevronRight,
  Bell, Settings, HelpCircle, Menu, X, Calendar, Home, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  BarChart, Bar, Legend
} from 'recharts';
import {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
  useGetTicketsQuery,
  useUpdateTicketStatusMutation,
  useReplyToTicketMutation,
  useGetFlaggedTransactionsQuery,
  useUpdateUserStatusMutation,
  useGetPotStatsQuery,
  useGetAdminDashboardDataQuery
} from '../../state/adminApi';

// Import component views
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import TransactionList from './TransactionList';
import TicketManagement from './TicketManagement';

// Move helper functions to the top, before the component
const calculateTicketGrowth = (tickets) => {
  if (!tickets?.length) return 0;
  
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  
  const recentTickets = tickets.filter(t => new Date(t.createdAt) >= oneWeekAgo);
  const previousTickets = tickets.filter(t => {
    const date = new Date(t.createdAt);
    return date < oneWeekAgo && date >= new Date(oneWeekAgo - 7 * 24 * 60 * 60 * 1000);
  });

  if (!previousTickets.length) return recentTickets.length * 100;
  
  return Math.round(((recentTickets.length - previousTickets.length) / previousTickets.length) * 100);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [currentView, setCurrentView] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registration", time: "10 min ago", read: false },
    { id: 2, message: "Suspicious transaction detected", time: "1 hour ago", read: false },
    { id: 3, message: "System update complete", time: "2 hours ago", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Check admin authentication on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      const adminToken = localStorage.getItem('adminToken');
      const isAdmin = localStorage.getItem('isAdmin');
      const adminUserStr = localStorage.getItem('adminUser');
      
      if (!adminToken || !isAdmin) {
        console.warn('Admin authentication incomplete');
        setIsAuthenticated(false);
        return false;
      }
      
      try {
        if (adminUserStr) {
          const parsedAdmin = JSON.parse(adminUserStr);
          setAdminData(parsedAdmin);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Admin data parse error:', error);
        setIsAuthenticated(false);
        return false;
      }
    };
    
    checkAuthentication();
  }, []);

  // Only proceed with data fetching if authenticated
  const skipQueries = !isAuthenticated;

  // First try to get comprehensive dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useGetAdminDashboardDataQuery(undefined, {
    skip: skipQueries || currentView !== 'overview'
  });

  // Fetch specific data based on current view as fallbacks
  const { data: adminStats, isLoading: statsLoading } = useGetAdminStatsQuery(undefined, {
    skip: skipQueries || (currentView !== 'overview')
  });

  const { data: transactionStats, isLoading: transactionsStatsLoading } = useGetTransactionStatsQuery(undefined, {
    skip: skipQueries || (currentView !== 'overview' && currentView !== 'transactions') || dashboardData?.transactionStats
  });

  const { data: users, isLoading: usersLoading } = useGetUsersQuery(undefined, {
    skip: skipQueries
  });

  const { data: transactions, isLoading: transactionsLoading } = useGetTransactionsQuery(undefined, {
    skip: skipQueries || (currentView !== 'overview' && currentView !== 'transactions')
  });

  const { data: tickets, isLoading: ticketsLoading } = useGetTicketsQuery(undefined, {
    skip: skipQueries,
    pollingInterval: 30000, // Poll every 30 seconds for new tickets
  });

  const { data: flaggedTransactions, isLoading: flaggedLoading } = useGetFlaggedTransactionsQuery(undefined, {
    skip: skipQueries || currentView !== 'overview'
  });

  const { data: potStats, isLoading: potsLoading } = useGetPotStatsQuery(undefined, {
    skip: skipQueries || currentView !== 'overview' || dashboardData?.potStats
  });

  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const [replyToTicket] = useReplyToTicketMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Prepare data from either dashboard data or individual queries
  const effectiveStats = useMemo(() => {
    if (adminStats) {
      return {
        ...adminStats,
        ticketResponseRate: Math.round((tickets?.filter(t => t.messages?.length > 1)?.length || 0) / (tickets?.length || 1) * 100),
        openTickets: tickets?.filter(t => t.status === 'open' || t.status === 'new')?.length || 0,
        ticketGrowthRate: calculateTicketGrowth(tickets)
      };
    }

    return {
      totalUsers: users?.length || 0,
      activeUsers: users?.filter(u => u.status === 'active')?.length || 0,
      inactiveUsers: users?.filter(u => u.status === 'inactive')?.length || 0,
      blockedUsers: users?.filter(u => u.status === 'blocked')?.length || 0,
      newUsers: 0,
      userGrowthRate: 0,
      openTickets: 0,
      ticketGrowthRate: 0,
      ticketResponseRate: 95
    };
  }, [adminStats, users, tickets]);

  const effectiveTransactionStats = useMemo(() => {
    if (dashboardData?.transactionStats) return dashboardData.transactionStats;
    return transactionStats || {
      totalTransactions: 0,
      totalVolume: 0,
      transactionGrowthRate: 0,
      volumeGrowthRate: 0,
      recentTransactions: [],
      volumeByMonth: [
        { month: 'Jan', volume: 0 },
        { month: 'Feb', volume: 0 },
        { month: 'Mar', volume: 0 },
        { month: 'Apr', volume: 0 },
        { month: 'May', volume: 0 },
        { month: 'Jun', volume: 0 },
      ]
    };
  }, [dashboardData, transactionStats]);

  const effectivePotStats = useMemo(() => {
    if (dashboardData?.potStats) return dashboardData.potStats;
    return potStats || {
      totalPots: 0,
      totalSavings: 0,
      potGrowthRate: 0,
      recentlyCreatedPots: 0
    };
  }, [dashboardData, potStats]);

  const effectiveFlaggedTransactions = useMemo(() => {
    if (dashboardData?.flaggedTransactions) return dashboardData.flaggedTransactions;
    return flaggedTransactions || [];
  }, [dashboardData, flaggedTransactions]);

  const effectiveTransactions = useMemo(() => {
    return transactions || [];
  }, [transactions]);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    const animateLogout = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
      navigate('/');
    };
    animateLogout();
  };

  const isLoading = 
    (currentView === 'overview' && (dashboardLoading || statsLoading || transactionsStatsLoading || flaggedLoading || potsLoading)) ||
    (currentView === 'users' && usersLoading) ||
    (currentView === 'transactions' && (transactionsLoading || transactionsStatsLoading)) ||
    (currentView === 'tickets' && ticketsLoading);

  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Limited Access Mode</h2>
            <p className="text-gray-600 mb-6">
              You are viewing the dashboard in limited access mode. Please login with admin credentials for full access.
            </p>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Return to Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg z-50 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-100">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Bank Admin</h1>
              <p className="text-blue-600 text-xs font-medium">Management Portal</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Main</h3>
            <ul className="space-y-2">
              {[
                { view: 'overview', icon: Home, label: 'Dashboard Overview' },
                { view: 'users', icon: Users, label: 'User Management' },
                { view: 'transactions', icon: Activity, label: 'Transactions' },
                { view: 'tickets', icon: TicketCheck, label: 'Support Tickets' }
              ].map((item) => (
                <motion.li key={item.view} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => handleViewChange(item.view)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentView === item.view
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${currentView === item.view ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.label}
                    {item.view === 'tickets' && tickets && tickets.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                      >
                        {tickets.filter(t => t.status === 'open').length}
                      </motion.span>
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="mb-4 px-4 py-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {adminData?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{adminData?.username || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{adminData?.role || 'Super Admin'}</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 202, 202, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 py-4 shadow-sm"
        >
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 lg:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentView === 'overview' && 'Dashboard Overview'}
                {currentView === 'users' && 'User Management'}
                {currentView === 'transactions' && 'Transaction History'}
                {currentView === 'tickets' && 'Support Tickets'}
              </h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-gray-500 text-xs">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          Mark all as read
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 ml-2"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 ml-2"
              >
                <HelpCircle className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
                  />
                  <p className="text-gray-500 text-sm">Loading data...</p>
                </div>
              ) : (
                <>
                  {currentView === 'overview' && (
                    <DashboardOverview 
                      stats={effectiveStats}
                      users={users || []}
                      transactionStats={effectiveTransactionStats}
                      potStats={effectivePotStats}
                      flaggedTransactions={effectiveFlaggedTransactions}
                      transactions={effectiveTransactions}
                    />
                  )}
                  
                  {currentView === 'users' && (
                    <UserManagement 
                      users={users || []}
                      toggleUserStatus={updateUserStatus}
                    />
                  )}
                  
                  {currentView === 'transactions' && (
                    <TransactionList 
                      transactionStats={effectiveTransactionStats} 
                      transactions={effectiveTransactions}
                    />
                  )}
                  
                  {currentView === 'tickets' && (
                    <TicketManagement 
                      tickets={tickets || []}
                      updateTicketStatus={updateTicketStatus}
                      replyToTicket={replyToTicket}
                      isLoading={ticketsLoading}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
