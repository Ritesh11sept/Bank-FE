import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { 
  LayoutDashboard,
  Users,
  FolderTree,
  Bell,
  MessageSquare,
  History,
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const DashboardHeader = ({ activeSection, setActiveSection, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Emerald green theme colors
  const emeraldGreen = '#10b981';
  const lightEmerald = '#d1fae5';
  const darkEmerald = '#059669';

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', text: 'User Management', icon: <Users size={20} /> },
    { id: 'budget', text: 'Budget Categories', icon: <FolderTree size={20} /> },
    { id: 'notifications', text: 'Notifications', icon: <Bell size={20} /> },
    { id: 'feedback', text: 'Feedback & Support', icon: <MessageSquare size={20} /> },
    { id: 'audit', text: 'Audit Logs', icon: <History size={20} /> },
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawerContent = (
    <Box 
      sx={{ 
        width: 280,
        height: '100%',
        background: 'linear-gradient(to bottom, #ffffff, #f7f7f7)',
        borderRight: 'none'
      }} 
      role="presentation"
    >
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        background: emeraldGreen,
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Avatar sx={{ 
          bgcolor: 'white', 
          color: emeraldGreen,
          mr: 2,
          fontWeight: 'bold'
        }}>
          A
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Admin Portal
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ opacity: 0.6, ml: 2, mb: 1 }}>
          MAIN MENU
        </Typography>
      </Box>
      
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.id} 
            selected={activeSection === item.id}
            onClick={() => handleSectionChange(item.id)}
            sx={{
              mb: 0.5,
              borderRadius: '8px',
              overflow: 'hidden',
              '&.Mui-selected': {
                backgroundColor: lightEmerald,
                color: darkEmerald,
                '& .MuiListItemIcon-root': {
                  color: emeraldGreen,
                },
                '&:hover': {
                  backgroundColor: lightEmerald,
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <ListItemIcon sx={{ 
              color: activeSection === item.id ? emeraldGreen : 'inherit',
              minWidth: '40px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activeSection === item.id ? '600' : '400',
                fontSize: '14px'
              }}
            />
            {activeSection === item.id && (
              <ChevronRight size={16} color={emeraldGreen} />
            )}
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2, mx: 2, opacity: 0.6 }} />
      
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ opacity: 0.6, mb: 1 }}>
          ACCOUNT
        </Typography>
      </Box>
      
      <List sx={{ px: 1 }}>
        <ListItem 
          button 
          onClick={onLogout}
          sx={{
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              color: '#f44336'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: '40px',
            '&:hover': { color: '#f44336' }
          }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '14px' }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          color: 'black',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              size="medium"
              edge="start"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                borderRadius: 1.5,
                color: 'inherit',
                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.08)' }
              }}
            >
              <Menu size={22} />
            </IconButton>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: emeraldGreen,
            mr: 4
          }}>
            <Avatar sx={{ 
              bgcolor: emeraldGreen, 
              color: 'white',
              width: 34,
              height: 34,
              fontWeight: 'bold'
            }}>
              A
            </Avatar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              FinanceFirst
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  sx={{ 
                    mx: 0.5,
                    py: 1,
                    px: 1.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    color: activeSection === item.id ? emeraldGreen : 'text.secondary',
                    backgroundColor: activeSection === item.id ? lightEmerald : 'transparent',
                    fontWeight: activeSection === item.id ? '600' : '400',
                    fontSize: '0.9rem',
                    borderBottom: activeSection === item.id ? `2px solid ${emeraldGreen}` : 'none',
                    '&:hover': {
                      backgroundColor: activeSection === item.id ? lightEmerald : 'rgba(16, 185, 129, 0.08)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    {React.createElement(item.icon.type, { 
                      size: 18, 
                      color: activeSection === item.id ? emeraldGreen : 'inherit' 
                    })}
                    {item.text}
                  </Box>
                </Button>
              ))}
            </Box>
          )}
          
          {!isMobile && (
            <Button 
              onClick={onLogout}
              sx={{ 
                ml: 'auto',
                py: 0.8,
                px: 2,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#f44336',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                  border: '1px solid rgba(244, 67, 54, 0.5)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={18} style={{ marginRight: '6px' }} />
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRight: 'none',
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default DashboardHeader;
