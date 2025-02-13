import { useState } from "react";
import { motion } from "framer-motion";
import { AppBar, Box, IconButton, Toolbar, Typography, Menu, MenuItem, Badge, Avatar, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Navbar = () => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      component={motion.div}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FlexBetween>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="white" fontWeight="bold">F</Typography>
              </Box>
              <Typography
                variant="h4"
                fontSize={20}
                sx={{
                  background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold"
                }}
              >
                Finanseer
              </Typography>
            </Box>
          </motion.div>
        </FlexBetween>

        <Box display="flex" gap={2} alignItems="center">
          {[SearchOutlinedIcon, NotificationsNoneIcon, EmailOutlinedIcon, SettingsOutlinedIcon].map((Icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton>
                <Badge badgeContent={index === 1 ? 4 : index === 2 ? 2 : 0} color="error">
                  <Icon />
                </Badge>
              </IconButton>
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton onClick={handleProfileClick}>
              <Avatar
                src="/path-to-avatar.jpg"
                sx={{
                  width: 35,
                  height: 35,
                  border: '2px solid',
                  borderColor: palette.primary.main
                }}
              />
            </IconButton>
          </motion.div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
