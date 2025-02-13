import { Box, Grid, Typography } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";

const Treasures = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Investment Treasures</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardBox>
            <Typography variant="h6">Investment Portfolio</Typography>
            {/* Add investment portfolio content here */}
          </DashboardBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Treasures;
