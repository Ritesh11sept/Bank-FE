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
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FlexBetween>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component={motion.div}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              sx={{
                width: 35,
                height: 35,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #10B981, #059669)',
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
                background: 'linear-gradient(135deg, #10B981, #059669)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold"
              }}
            >
              Finanseer
            </Typography>
          </Box>
        </FlexBetween>

        <Box display="flex" gap={2} alignItems="center">
          {[SearchOutlinedIcon, NotificationsNoneIcon, EmailOutlinedIcon, SettingsOutlinedIcon].map((Icon, index) => (
            <IconButton
              key={index}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                }
              }}
            >
              <Badge badgeContent={index === 1 ? 4 : index === 2 ? 2 : 0} color="success">
                <Icon />
              </Badge>
            </IconButton>
          ))}

          <Avatar
            sx={{
              width: 35,
              height: 35,
              border: '2px solid',
              borderColor: '#10B981',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
              }
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
