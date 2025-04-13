import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, Chip, Zoom, Fade, Avatar } from '@mui/material';
import { LogOut, User, Users, Star, Receipt, Bell, MessageSquare, FileText, TrendingUp, Award, Layers, BarChart2, PieChart, Activity } from 'lucide-react';
import { 
  useGetSystemStatsQuery,
  useGetAllUsersQuery,
  useGetTransactionsStatsQuery,
  useGetActiveUsersQuery,
  useGetFlaggedTransactionsQuery,
  useGetPotStatisticsQuery
} from '../state/api';
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
import AdminLoginModal from './AdminLoginModal';

const AdminDashboard = () => {
  const theme = useTheme();
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

  const { data: systemStats = {} } = useGetSystemStatsQuery(undefined, { 
    skip: !isAuthenticated
  });
  const { data: usersData = [] } = useGetAllUsersQuery(undefined, { 
    skip: !isAuthenticated
  });
  const { data: transactionsStats = {} } = useGetTransactionsStatsQuery(undefined, { 
    skip: !isAuthenticated
  });
  const { data: activeUsers = {} } = useGetActiveUsersQuery(undefined, { 
    skip: !isAuthenticated
  });
  const { data: flaggedTransactions = [] } = useGetFlaggedTransactionsQuery(undefined, { skip: !isAuthenticated });
  const { data: potStatistics = {} } = useGetPotStatisticsQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginModal onAuthSuccess={handleAuthSuccess} />;
  }

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
                  label="Last updated: Just now" 
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
                { title: "Total Users", value: systemStats?.totalUsers || 0, icon: <Users size={22} />, color: emeraldGreen, bgColor: lightEmerald, growth: "+14.5%" },
                { title: "Active Users", value: systemStats?.activeUsers || 0, icon: <User size={22} />, color: indigo, bgColor: lightIndigo, growth: "+12.3%" },
                { title: "Premium Users", value: systemStats?.premiumUsers || 0, icon: <Star size={22} />, color: amber, bgColor: lightAmber, growth: "+8.7%" },
                { title: "Total Transactions", value: systemStats?.totalTransactions || 0, icon: <Receipt size={22} />, color: rose, bgColor: lightRose, growth: "+16.2%" }
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
                      <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                        {item.value.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp size={14} color={emeraldGreen} />
                        <Typography variant="caption" sx={{ color: emeraldGreen, fontWeight: 600 }}>
                          {item.growth} from last month
                        </Typography>
                      </Box>
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
                  <BudgetTrendsChart data={transactionsStats?.monthlyData || []} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    minHeight: 380,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: lightAmber, width: 40, height: 40 }}>
                        <PieChart size={20} color={amber} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">Most Used Features</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <FeatureUsageChart data={systemStats?.featureUsage || []} />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {['Budgeting', 'Analytics', 'Bill Pay', 'Savings'].map((feature, i) => (
                      <Chip 
                        key={i}
                        size="small" 
                        label={feature} 
                        sx={{ 
                          bgcolor: i === 0 ? lightEmerald : 
                                  i === 1 ? lightIndigo : 
                                  i === 2 ? lightAmber : lightRose,
                          color: i === 0 ? darkEmerald : 
                                i === 1 ? indigo : 
                                i === 2 ? amber : rose,
                          fontWeight: 500 
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    minHeight: 340,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: lightIndigo, width: 40, height: 40 }}>
                        <Award size={20} color={indigo} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">Financial Wellness Score</Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label="Quarterly analysis" 
                      sx={{ bgcolor: lightIndigo, color: indigo, fontWeight: 500 }}
                    />
                  </Box>
                  <FinancialWellnessChart data={systemStats?.wellnessScores || []} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    minHeight: 340,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: lightRose, width: 40, height: 40 }}>
                        <Activity size={20} color={rose} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="600">Active Users Timeline</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Day by day" 
                        sx={{ bgcolor: lightRose, color: rose, fontWeight: 500 }}
                      />
                      <Chip 
                        size="small" 
                        label="Real-time" 
                        sx={{ bgcolor: lightEmerald, color: darkEmerald, fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                  <BudgetTrendsChart data={activeUsers?.timeline || []} isUserChart />
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : activeSection === 'users' ? (
          <UserManagement usersData={usersData} />
        ) : activeSection === 'budget' ? (
          <BudgetCategoryMonitoring data={potStatistics} />
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
