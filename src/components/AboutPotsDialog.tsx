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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#6366F1', color: 'white' }}>
        About Savings Pots
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" paragraph>
            Savings Pots are smart and flexible ways to organize your savings for different goals.
            Think of them as digital piggy banks that help you save and track progress towards specific targets.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#6366F1' }}>
            Key Features
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <SavingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Dedicated Savings"
                secondary="Create separate pots for different goals like emergency funds, travel, or big purchases"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountBalanceIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="2.5% Annual Interest"
                secondary="Earn interest on your savings to help reach your goals faster"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Goal Tracking"
                secondary="Set targets and track your progress with visual progress bars"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Flexible Management"
                secondary="Easily deposit, withdraw, or modify your savings goals anytime"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#6366F1' }}>
            How to Use
          </Typography>

          <Typography component="div">
            <ol>
              <li>Click "Create New Pot" to start a new savings goal</li>
              <li>Choose a category and name for your pot</li>
              <li>Set an optional target amount</li>
              <li>Make regular deposits to grow your savings</li>
              <li>Track your progress and adjust goals as needed</li>
            </ol>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#6366F1' }}>
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutPotsDialog;
