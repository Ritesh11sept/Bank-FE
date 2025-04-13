import { useTheme, Box, Typography, Paper, alpha } from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

const BudgetTrendsChart = ({ data = [], isUserChart = false, title }) => {
  const theme = useTheme();
  
  // If no data, create sample data
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', income: 4200, expenses: 2400, savings: 1800 },
    { month: 'Feb', income: 4500, expenses: 2800, savings: 1700 },
    { month: 'Mar', income: 5100, expenses: 3000, savings: 2100 },
    { month: 'Apr', income: 5400, expenses: 3300, savings: 2100 },
    { month: 'May', income: 5200, expenses: 3100, savings: 2100 },
    { month: 'Jun', income: 5800, expenses: 3500, savings: 2300 },
  ];
  
  const userChartData = data.length > 0 ? data : [
    { day: 'Mon', active: 120, new: 25 },
    { day: 'Tue', active: 132, new: 18 },
    { day: 'Wed', active: 145, new: 22 },
    { day: 'Thu', active: 140, new: 20 },
    { day: 'Fri', active: 155, new: 24 },
    { day: 'Sat', active: 170, new: 28 },
    { day: 'Sun', active: 180, new: 30 },
  ];

  // Custom emerald colors
  const EMERALD = {
    primary: '#10B981',      // Main emerald
    secondary: '#059669',    // Dark emerald
    light: '#6EE7B7',        // Light emerald
    ultraLight: '#D1FAE5',   // Very light emerald
    dark: '#064E3B',         // Very dark emerald
    error: '#EF4444',        // Error red
    info: '#3B82F6'          // Info blue
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'white',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="subtitle2" color={EMERALD.dark} fontWeight={600}>
            {label}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {payload.map((entry, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 0.5 
                }}
              >
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    backgroundColor: entry.color, 
                    borderRadius: '50%', 
                    mr: 1 
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {entry.name}: {isUserChart ? entry.value : `$${entry.value}`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: alpha(EMERALD.primary, 0.2),
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fdfb 100%)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: EMERALD.dark,
            fontWeight: 600,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: 0,
              width: '40px',
              height: '3px',
              backgroundColor: EMERALD.primary,
              borderRadius: '2px'
            }
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          {isUserChart ? (
            <BarChart
              data={userChartData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 5,
              }}
              barGap={4}
              barCategoryGap={16}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#9CA3AF', 0.2)} vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 15,
                  fontSize: '13px'
                }}
              />
              <Bar 
                dataKey="active" 
                name="Active Users" 
                fill={EMERALD.primary} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="new" 
                name="New Users" 
                fill={EMERALD.light} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EMERALD.primary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={EMERALD.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EMERALD.error} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={EMERALD.error} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EMERALD.info} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={EMERALD.info} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#9CA3AF', 0.2)} vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 15,
                  fontSize: '13px'
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={EMERALD.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
                activeDot={{ r: 6, fill: EMERALD.primary, strokeWidth: 2, stroke: 'white' }}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                name="Expenses" 
                stroke={EMERALD.error}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                activeDot={{ r: 6, fill: EMERALD.error, strokeWidth: 2, stroke: 'white' }}
              />
              <Area 
                type="monotone" 
                dataKey="savings" 
                name="Savings" 
                stroke={EMERALD.info}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSavings)"
                activeDot={{ r: 6, fill: EMERALD.info, strokeWidth: 2, stroke: 'white' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BudgetTrendsChart;
