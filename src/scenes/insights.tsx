import { Box, Grid, Typography } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, CartesianGrid } from "recharts";
import { useTheme } from "@mui/material";

const Insights = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Financial Insights</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DashboardBox>
            <FlexBetween>
              <Typography variant="h6">Revenue Overview</Typography>
            </FlexBetween>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke={palette.primary.main} />
                <Line type="monotone" dataKey="expenses" stroke={palette.secondary.main} />
              </LineChart>
            </ResponsiveContainer>
          </DashboardBox>
        </Grid>
        <Grid item xs={12} lg={4}>
          <DashboardBox>
            <Typography variant="h6">Recent Activity</Typography>
            {/* Add activity feed component here */}
          </DashboardBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Insights;
