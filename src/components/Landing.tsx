import { Box, Card, Typography, Container, Grid, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Sidebar from "./Sidebar";

const Landing = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Analytics",
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      description: "Analyze your financial data with interactive charts and insights",
      path: "/dashboard",
      color: "#2196F3"
    },
    {
      title: "Account Overview",
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      description: "Check your account balance and recent transactions",
      path: "/account",
      color: "#4CAF50"
    },
    {
      title: "Market Predictions",
      icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
      description: "View AI-powered market predictions and trends",
      path: "/predictions",
      color: "#FF9800"
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { xs: 0, sm: '240px' },
          mt: '64px', // Add top margin for navbar
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            <Typography
              component={motion.h1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              variant="h3"
              gutterBottom
              sx={{ mb: 4, fontWeight: "bold" }}
            >
              Welcome Back, User!
            </Typography>

            <Grid container spacing={3}>
              {cards.map((card, index) => (
                <Grid item xs={12} md={4} key={card.title}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      p: 3,
                      height: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      }
                    }}
                    onClick={() => navigate(card.path)}
                  >
                    <IconButton
                      sx={{
                        mb: 2,
                        bgcolor: `${card.color}15`,
                        color: card.color,
                        '&:hover': { bgcolor: `${card.color}25` }
                      }}
                      size="large"
                    >
                      {card.icon}
                    </IconButton>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
