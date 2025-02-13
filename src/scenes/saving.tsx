import { Box, Grid, Typography, Card, LinearProgress } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";

const Savings = () => {
  const savingsGoals = [
    {
      title: "Emergency Fund",
      current: 15000,
      target: 50000,
      progress: 30,
      color: "#2196F3"
    },
    {
      title: "Vacation",
      current: 25000,
      target: 100000,
      progress: 25,
      color: "#4CAF50"
    },
    {
      title: "New Car",
      current: 200000,
      target: 500000,
      progress: 40,
      color: "#FF9800"
    },
    {
      title: "Home Down Payment",
      current: 500000,
      target: 1000000,
      progress: 50,
      color: "#9C27B0"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Savings Goals</Typography>
      
      <Grid container spacing={3}>
        {savingsGoals.map((goal) => (
          <Grid item xs={12} md={6} key={goal.title}>
            <DashboardBox>
              <FlexBetween>
                <Typography variant="h6">{goal.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {((goal.current / goal.target) * 100).toFixed(0)}%
                </Typography>
              </FlexBetween>
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={goal.progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: `${goal.color}15`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: goal.color,
                    }
                  }}
                />
              </Box>
              
              <FlexBetween>
                <Typography variant="body2" color="text.secondary">
                  Current: ₹{goal.current.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: ₹{goal.target.toLocaleString()}
                </Typography>
              </FlexBetween>
            </DashboardBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Savings;
