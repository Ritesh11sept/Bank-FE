import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, useTheme, Divider } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import SavingsIcon from '@mui/icons-material/Savings';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Analytics', icon: <ShowChartIcon />, path: '/predictions' },
    { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
    { text: 'Payments', icon: <PaymentsIcon />, path: '/payments' },
    { text: 'Savings', icon: <SavingsIcon />, path: '/savings' },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
  ];

  const DrawerContent = () => (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        pt: '64px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List sx={{ px: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              button
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                my: 0.5,
                borderRadius: 2,
                bgcolor: location.pathname === item.path 
                  ? `${theme.palette.primary.main}15`
                  : 'transparent',
                color: location.pathname === item.path 
                  ? theme.palette.primary.main
                  : 'text.primary',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}25`,
                  transform: 'translateX(8px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 40,
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : 'text.secondary'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 2, mt: 'auto', mb: 2 }}>
        {bottomMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: (menuItems.length + index) * 0.1 }}
          >
            <ListItem
              button
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                my: 0.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}15`,
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </motion.div>
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
            width: 240,
            borderRight: 'none',
            boxShadow: theme.shadows[3],
            bgcolor: 'background.paper',
          },
        }}
      >
        <DrawerContent />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            borderRight: 'none',
            boxShadow: theme.shadows[3],
            bgcolor: 'background.paper',
          },
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
