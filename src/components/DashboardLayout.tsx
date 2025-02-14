import { Box } from "@mui/material";
import Navbar from "@/scenes/navbar";
import Sidebar from "@/components/Sidebar";
import BaseLayout from "./BaseLayout";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <BaseLayout>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
      }}>
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: '64px',
            pl: { sm: '240px' },
            width: { sm: `calc(100% - 240px)` },
            minHeight: '100vh',
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>
    </BaseLayout>
  );
};

export default DashboardLayout;
