import { useTheme } from '@mui/material';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

const FeatureUsageChart = ({ data = [] }) => {
  const theme = useTheme();
  
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { name: 'Budgeting', value: 35 },
    { name: 'Savings Pots', value: 25 },
    { name: 'Transactions', value: 20 },
    { name: 'Reports', value: 10 },
    { name: 'Rewards', value: 10 },
  ];
  
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FeatureUsageChart;
