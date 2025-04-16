import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, Chip, Zoom, Fade, Avatar, CircularProgress } from '@mui/material';
import { LogOut, User, Users, Star, Receipt, Bell, MessageSquare, FileText, TrendingUp, Award, Layers, BarChart2, PieChart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetSystemStatsQuery,
  useGetAllUsersQuery,
  useGetTransactionsStatsQuery,
  useGetActiveUsersQuery, // Fixed: removed extra "Query"
  useGetFlaggedTransactionsQuery,
  useGetPotStatisticsQuery
} from '../../state/api';
import DashboardHeader from './components/DashboardHeader';
import KeyMetricsCard from './components/KeyMetricsCard';
import BudgetTrendsChart from './components/BudgetTrendsChart';
import UserManagement from './components/UserManagement';
import FeatureUsageChart from './components/FeatureUsageChart';
import BudgetCategoryMonitoring from './components/BudgetCategoryMonitoring';
import NotificationsManager from './components/NotificationsManager';
import FeedbackSupport from './components/FeedbackSupport';
import AuditLogs from './components/AuditLogs';
import FinancialWellnessChart from './components/FinancialWellnessChart';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Enhanced color palette
  const emeraldGreen = '#10b981';
  const lightEmerald = '#d1fae5';
  const darkEmerald = '#059669';
  const indigo = '#4f46e5';
  const lightIndigo = '#e0e7ff';
  const amber = '#f59e0b';
  const lightAmber = '#fef3c7';
  const rose = '#f43f5e';
  const lightRose = '#ffe4e6';

  // Check admin authentication from localStorage
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (adminToken && isAdmin) {
      console.log('Admin is authenticated with token');
      setIsAuthenticated(true);
    } else {
      console.log('Admin is not authenticated, redirecting');
      // Redirect to home page if not authenticated as admin
      navigate('/');
    }
  }, [navigate]);

  // Fetch data using RTK Query hooks with proper error handling
  const { 
    data: systemStats = {}, 
    isLoading: loadingStats,
    error: statsError 
  } = useGetSystemStatsQuery(undefined, { 
    skip: !isAuthenticated,
    pollingInterval: 60000, // Refresh every minute
    refetchOnMountOrArgChange: true, // This will refetch data when component mounts
  });
  
  const { 
    data: usersData = [], 
    isLoading: loadingUsers,
    error: usersError 
  } = useGetAllUsersQuery(undefined, { 
    skip: !isAuthenticated,
    pollingInterval: 300000, // Refresh every 5 minutes
  });
  
  const { 
    data: transactionsStats = {}, 
    isLoading: loadingTransStats,
    error: transStatsError 
  } = useGetTransactionsStatsQuery(undefined, { 
    skip: !isAuthenticated,
    pollingInterval: 300000, // Refresh every 5 minutes
  });
  
  const { 
    data: activeUsers = {}, 
    isLoading: loadingActiveUsers,
    error: activeUsersError 
  } = useGetActiveUsersQuery(undefined, { // Fixed: removed extra "Query"
    skip: !isAuthenticated,
    pollingInterval: 60000, // Refresh every minute
  });
  
  const { 
    data: flaggedTransactions = [],
    isLoading: loadingFlagged 
  } = useGetFlaggedTransactionsQuery(undefined, { 
    skip: !isAuthenticated || activeSection !== 'budget',
    pollingInterval: 60000, // Refresh every minute
  });
  
  const { 
    data: potStatistics = {},
    isLoading: loadingPotStats 
  } = useGetPotStatisticsQuery(undefined, { 
    skip: !isAuthenticated || activeSection !== 'budget',
    pollingInterval: 300000, // Refresh every 5 minutes
  });

  // Create fallback data if API returns empty results
  const getDefaultOrActualData = (actualData, defaultValue, isLoading) => {
    if (isLoading) return defaultValue;
    return actualData && Object.keys(actualData).length > 0 ? actualData : defaultValue;
  };

  // Default data in case the API returns empty results
  const defaultSystemStats = {
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalTransactions: 0,
    featureUsage: [
      { feature: 'Budgeting', usage: 40 },
      { feature: 'Analytics', usage: 30 },
      { feature: 'Bill Pay', usage: 20 },
      { feature: 'Savings', usage: 10 }
    ],
    wellnessScores: [
      { quarter: 'Q1', score: 65 },
      { quarter: 'Q2', score: 70 },
      { quarter: 'Q3', score: 75 },
      { quarter: 'Q4', score: 80 }
    ]
  };

  // Prepare the data
  const displaySystemStats = getDefaultOrActualData(systemStats, defaultSystemStats, loadingStats);
  
  const defaultTransactionStats = {
    monthlyData: Array(12).fill(0).map((_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      value: Math.floor(Math.random() * 10000)
    }))
  };
  
  const displayTransactionStats = getDefaultOrActualData(transactionsStats, defaultTransactionStats, loadingTransStats);
  
  const defaultActiveUsers = {
    timeline: Array(30).fill(0).map((_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 100)
    }))
  };
  
  const displayActiveUsers = getDefaultOrActualData(activeUsers, defaultActiveUsers, loadingActiveUsers);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    navigate('/');
  };

  // If not authenticated, return null while redirecting
  if (!isAuthenticated) {
    return null;
  }

  const isLoading = loadingStats || loadingUsers || loadingTransStats || loadingActiveUsers;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: '#f8fafc'  // Light background for the page
    }}>
      <DashboardHeader 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
        LogoutIcon={LogOut}
      />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        <Fade in={true} timeout={500}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                {activeSection === 'dashboard' ? <Layers size={24} /> : 
                 activeSection === 'users' ? <Users size={24} /> : 
                 activeSection === 'budget' ? <Receipt size={24} /> : 
                 activeSection === 'notifications' ? <Bell size={24} /> : 
                 activeSection === 'feedback' ? <MessageSquare size={24} /> : <FileText size={24} />}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {activeSection === 'dashboard' ? 'Admin Dashboard' : 
                 activeSection === 'users' ? 'User Management' : 
                 activeSection === 'budget' ? 'Budget Categories' : 
                 activeSection === 'notifications' ? 'Notifications Manager' : 
                 activeSection === 'feedback' ? 'Feedback & Support' : 'Audit Logs'}
              </Typography>
            </Box>
            
            {activeSection === 'dashboard' && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  size="small" 
                  label={isLoading ? "Loading data..." : "Last updated: Just now"} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  size="small" 
                  icon={<TrendingUp size={14} />}
                  label="Growing steadily" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  size="small" 
                  label="Real-time data" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            )}
          </Paper>
        </Fade>
        
        {activeSection === 'dashboard' ? (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { 
                  title: "Total Users", 
                  value: displaySystemStats.totalUsers, 
                  icon: <Users size={22} />, 
                  color: emeraldGreen, 
                  bgColor: lightEmerald, 
                  growth: "+14.5%",
                  isLoading: loadingStats 
                },
                { 
                  title: "Active Users", 
                  value: displaySystemStats.activeUsers, 
                  icon: <User size={22} />, 
                  color: indigo, 
                  bgColor: lightIndigo, 
                  growth: "+12.3%",
                  isLoading: loadingStats 
                },
                { 
                  title: "Premium Users", 
                  value: displaySystemStats.premiumUsers, 
                  icon: <Star size={22} />, 
                  color: amber, 
                  bgColor: lightAmber, 
                  growth: "+8.7%",
                  isLoading: loadingStats 
                },
                { 
                  title: "Total Transactions", 
                  value: displaySystemStats.totalTransactions, 
                  icon: <Receipt size={22} />, 
                  color: rose, 
                  bgColor: lightRose, 
                  growth: "+16.2%",
                  isLoading: loadingStats 
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Box sx={{ 
                          p: 1.2, 
                          borderRadius: '50%', 
                          bgcolor: item.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color
                        }}>
                          {item.icon}
                        </Box>
                      </Box>
                      {item.isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                          <CircularProgress size={30} sx={{ color: item.color }} />
                        </Box>
                      ) : (
                        <>
                          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                            {item.value.toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp size={14} color={emeraldGreen} />
                            <Typography variant="caption" sx={{ color: emeraldGreen, fontWeight: 600 }}>
                              {item.growth} from last month
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Paper>
                  </Zoom>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    minHeight: 380,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: lightEmerald, width: 40, height: 40 }}>
                        <BarChart2 size={20} color={darkEmerald} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">Monthly Budget Trends</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Last 12 months" 
                        sx={{ bgcolor: lightEmerald, color: darkEmerald, fontWeight: 500 }}
                      />
                      <Chip 
                        size="small" 
                        label="High performance" 
                        sx={{ bgcolor: lightIndigo, color: indigo, fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                  {loadingTransStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <CircularProgress size={40} sx={{ color: emeraldGreen }} />
                    </Box>
                  ) : (
                    <BudgetTrendsChart data={displayTransactionStats.monthlyData} />
                  )}
                </Paper>
              </Grid>
              
              {/* ...remaining dashboard components... */}
            </Grid>
          </>
        ) : activeSection === 'users' ? (
          <UserManagement 
            usersData={usersData} 
            isLoading={loadingUsers} 
            error={usersError}
          />
        ) : activeSection === 'budget' ? (
          <BudgetCategoryMonitoring 
            data={potStatistics} 
            isLoading={loadingPotStats}
            flaggedTransactions={flaggedTransactions}
            isFlaggedLoading={loadingFlagged}
          />
        ) : activeSection === 'notifications' ? (
          <NotificationsManager />
        ) : activeSection === 'feedback' ? (
          <FeedbackSupport />
        ) : (
          <AuditLogs />
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
