import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

interface AboutPotsDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutPotsDialog: React.FC<AboutPotsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(to right, #10B981, #059669)',
        color: 'white',
        py: 3
      }}>
        About Savings Pots
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 3 }}>
          <Typography variant="body1" paragraph>
            Savings Pots are smart and flexible ways to organize your savings for different goals.
            Think of them as digital piggy banks that help you save and track progress towards specific targets.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#10B981', fontWeight: 600 }}>
            Key Features
          </Typography>

          <List>
            {[
              {
                icon: <SavingsIcon sx={{ color: '#10B981' }} />,
                primary: "Dedicated Savings",
                secondary: "Create separate pots for different goals like emergency funds, travel, or big purchases"
              },
              {
                icon: <AccountBalanceIcon sx={{ color: '#10B981' }} />,
                primary: "2.5% Annual Interest",
                secondary: "Earn interest on your savings to help reach your goals faster"
              },
              {
                icon: <TrendingUpIcon sx={{ color: '#10B981' }} />,
                primary: "Goal Tracking",
                secondary: "Set targets and track your progress with visual progress bars"
              },
              {
                icon: <SecurityIcon sx={{ color: '#10B981' }} />,
                primary: "Flexible Management",
                secondary: "Easily deposit, withdraw, or modify your savings goals anytime"
              }
            ].map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{
                    fontWeight: 500
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #10B981, #059669)',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(to right, #059669, #047857)'
            }
          }}
        >
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutPotsDialog;
