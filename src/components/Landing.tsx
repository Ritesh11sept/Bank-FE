import { Box, Card, Typography, Container, Grid, IconButton, LinearProgress, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PaymentsIcon from '@mui/icons-material/Payments';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Sidebar from "./Sidebar";
import Navbar from "@/scenes/navbar";

const Landing = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Analytics Dashboard",
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      description: "Track your financial performance with AI-powered insights",
      path: "/dashboard",
      color: "#2196F3",
      stats: { value: "₹45,672", change: "+12.5%" },
      progress: 75
    },
    {
      title: "Account Balance",
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      description: "View and manage your account transactions",
      path: "/account",
      color: "#4CAF50",
      stats: { value: "₹1,23,456", change: "+5.2%" },
      progress: 65
    },
    {
      title: "Market Analysis",
      icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
      description: "Real-time market trends and predictions",
      path: "/predictions",
      color: "#FF9800",
      stats: { value: "₹89,120", change: "-2.3%" },
      progress: 45
    },
    {
      title: "Quick Payments",
      icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
      description: "Fast and secure payment transactions",
      path: "/payments",
      color: "#E91E63",
      stats: { value: "₹12,890", change: "+8.7%" },
      progress: 90
    },
    {
      title: "Savings Goals",
      icon: <SavingsIcon sx={{ fontSize: 40 }} />,
      description: "Track and manage your saving targets",
      path: "/savings",
      color: "#9C27B0",
      stats: { value: "₹34,567", change: "+15.3%" },
      progress: 60
    },
    {
      title: "Digital Wallet",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      description: "Manage your digital assets securely",
      path: "/wallet",
      color: "#607D8B",
      stats: { value: "₹67,234", change: "+9.1%" },
      progress: 85
    },
    {
      title: "Credit Cards",
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      description: "Manage your credit cards and rewards",
      path: "/cards",
      color: "#795548",
      stats: { value: "₹23,456", change: "+3.8%" },
      progress: 70
    },
    {
      title: "Investments",
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      description: "Track your investment portfolio",
      path: "/investments",
      color: "#673AB7",
      stats: { value: "₹78,901", change: "+6.4%" },
      progress: 55
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { xs: 0, sm: '240px' },
          mt: '64px',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{ 
                  mb: 4, 
                  fontWeight: "bold",
                  background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Welcome Back, User!
              </Typography>

              <Grid container spacing={3}>
                {cards.map((card, index) => (
                  <Grid item xs={12} md={6} lg={3} key={card.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        component={motion.div}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        sx={{
                          p: 3,
                          height: '100%',
                          cursor: 'pointer',
                          background: `linear-gradient(135deg, ${card.color}08, ${card.color}15)`,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid',
                          borderColor: `${card.color}20`,
                          borderRadius: 4,
                        }}
                        onClick={() => navigate(card.path)}
                      >
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <IconButton
                            sx={{
                              bgcolor: `${card.color}15`,
                              color: card.color,
                              '&:hover': { bgcolor: `${card.color}25` }
                            }}
                            size="large"
                          >
                            {card.icon}
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 5,
                              bgcolor: card.stats.change.includes('+') ? 'success.lighter' : 'error.lighter',
                              color: card.stats.change.includes('+') ? 'success.main' : 'error.main',
                            }}
                          >
                            {card.stats.change}
                          </Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {card.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {card.description}
                        </Typography>

                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
                          {card.stats.value}
                        </Typography>

                        <LinearProgress 
                          variant="determinate" 
                          value={card.progress}
                          sx={{
                            height: 6,
                            borderRadius: 5,
                            bgcolor: `${card.color}15`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: card.color,
                            }
                          }}
                        />
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
