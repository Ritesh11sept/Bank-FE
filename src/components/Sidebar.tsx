import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, useTheme } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Predictions', icon: <ShowChartIcon />, path: '/predictions' },
  ];

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: theme.palette.background.paper,
      pt: '64px', // Add top padding for navbar
    }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
              color: location.pathname === item.path ? 'common.white' : 'text.primary',
              '&:hover': {
                bgcolor: location.pathname === item.path 
                  ? 'primary.dark'
                  : 'primary.light',
                color: location.pathname === item.path 
                  ? 'common.white'
                  : 'primary.main',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'common.white' : 'primary.main',
              minWidth: 40 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: 240 },
        flexShrink: { sm: 0 },
        position: 'fixed',
        zIndex: theme.zIndex.appBar - 1,
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            borderRight: 'none',
            boxShadow: 3,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            borderRight: 'none',
            boxShadow: 3,
            bgcolor: 'background.paper',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
