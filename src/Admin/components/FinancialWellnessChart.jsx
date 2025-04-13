import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  LinearProgress,
  Grid,
  Paper,
  Divider 
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const FinancialWellnessChart = ({ data = [] }) => {
  const theme = useTheme();

  // If no data is provided, use this sample data
  const sampleData = data.length ? data : [
    { score: "Excellent", count: 150, percentage: 15 },
    { score: "Good", count: 350, percentage: 35 },
    { score: "Average", count: 300, percentage: 30 },
    { score: "Fair", count: 150, percentage: 15 },
    { score: "Poor", count: 50, percentage: 5 }
  ];

  const barColors = {
    Excellent: '#4caf50',
    Good: '#8bc34a',
    Average: '#ffc107',
    Fair: '#ff9800',
    Poor: '#f44336'
  };

  // Distribution data for pie chart
  const pieData = sampleData.map(item => ({
    name: item.score,
    value: item.count
  }));

  // Average wellness score calculation (weighted average)
  const totalUsers = sampleData.reduce((acc, item) => acc + item.count, 0);
  const scoreValues = {
    Excellent: 5,
    Good: 4,
    Average: 3,
    Fair: 2,
    Poor: 1
  };
  
  const weightedSum = sampleData.reduce((acc, item) => 
    acc + (item.count * scoreValues[item.score]), 0);
  
  const averageScore = totalUsers ? (weightedSum / totalUsers).toFixed(1) : 0;
  const maxPossibleScore = 5; // Maximum possible score
  const averagePercentage = (averageScore / maxPossibleScore) * 100;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, boxShadow: 2 }}>
          <Typography variant="body2" color="text.primary">
            {payload[0].payload.score}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Count: ${payload[0].payload.count} users`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${payload[0].payload.percentage}% of users`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const renderScoreLabel = () => {
    if (averageScore >= 4.5) return "Excellent";
    if (averageScore >= 3.5) return "Good";
    if (averageScore >= 2.5) return "Average";
    if (averageScore >= 1.5) return "Fair";
    return "Poor";
  };

  const getScoreColor = () => {
    if (averageScore >= 4.5) return barColors.Excellent;
    if (averageScore >= 3.5) return barColors.Good;
    if (averageScore >= 2.5) return barColors.Average;
    if (averageScore >= 1.5) return barColors.Fair;
    return barColors.Poor;
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Average Wellness Score: <strong>{averageScore}</strong> - {renderScoreLabel()}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={averagePercentage} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: getScoreColor(),
              borderRadius: 5
            }
          }} 
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Score Distribution
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sampleData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="score" 
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {sampleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[entry.score]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Percentage Breakdown
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={barColors[entry.name]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialWellnessChart;
