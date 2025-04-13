import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Tabs,
  Tab,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import { CheckCircle, MessageCircle, LifeBuoy, MessageSquare, Star } from 'lucide-react';

const FeedbackSupport = () => {
  const theme = useTheme();
  const emerald = {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff'
  };
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [supportTickets, setSupportTickets] = useState([
    { id: 1, user: 'john.doe@example.com', subject: 'Cannot access budget tool', message: 'When I try to access the budget tool, it shows an error message.', status: 'open', date: '2023-11-01' },
    { id: 2, user: 'jane.smith@example.com', subject: 'Issue with transaction categorization', message: 'Transactions are being categorized incorrectly.', status: 'open', date: '2023-11-02' },
    { id: 3, user: 'mike.wilson@example.com', subject: 'Premium subscription question', message: 'I paid for premium but don\'t see the features.', status: 'closed', date: '2023-10-25', resolution: 'Account upgraded manually, features now available' }
  ]);

  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, user: 'alex.brown@example.com', rating: 4, message: 'Great app overall, but would love to see more investment tracking features', date: '2023-11-01' },
    { id: 2, user: 'sarah.johnson@example.com', rating: 5, message: 'The new budget planner is amazing! So intuitive and helpful', date: '2023-10-30' },
    { id: 3, user: 'robert.davis@example.com', rating: 3, message: 'App works well but crashes sometimes when I try to add a new savings goal', date: '2023-10-28' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleCloseTicket = () => {
    if (selectedTicket && responseText) {
      setSupportTickets(supportTickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, status: 'closed', resolution: responseText } 
          : ticket
      ));
      setResponseText('');
      setDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
    setResponseText('');
  };

  const getStatusChip = (status) => {
    return (
      <Chip 
        size="small" 
        label={status} 
        sx={{ 
          bgcolor: status === 'open' ? alpha(emerald.main, 0.1) : alpha('#4caf50', 0.1),
          color: status === 'open' ? emerald.main : '#2e7d32',
          textTransform: 'capitalize',
          fontWeight: 500,
          border: 'none',
        }}
      />
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return emerald.main;
    if (rating === 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px 0 ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: emerald.main,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              minWidth: 150,
              '&.Mui-selected': {
                color: emerald.main,
              },
            },
          }}
        >
          <Tab 
            label="Support Tickets" 
            icon={<LifeBuoy size={18} />} 
            iconPosition="start" 
          />
          <Tab 
            label="User Feedback" 
            icon={<MessageSquare size={18} />} 
            iconPosition="start"
          />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 600,
                mb: 2
              }}
            >
              <LifeBuoy size={20} color={emerald.main} style={{ marginRight: '8px' }} />
              User Support Tickets
            </Typography>
            <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
              {supportTickets.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No support tickets available</Typography>
                </Box>
              ) : (
                supportTickets.map((ticket, index) => (
                  <Box key={ticket.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: alpha(emerald.light, 0.05) 
                        },
                        borderRadius: 1
                      }}
                      secondaryAction={
                        ticket.status === 'open' ? (
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<MessageCircle size={16} />}
                            onClick={() => handleTicketSelect(ticket)}
                            sx={{ 
                              bgcolor: emerald.main, 
                              '&:hover': { 
                                bgcolor: emerald.dark 
                              },
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 500,
                              boxShadow: `0 4px 8px 0 ${alpha(emerald.main, 0.3)}`
                            }}
                          >
                            Respond
                          </Button>
                        ) : (
                          <IconButton disabled sx={{ color: '#4caf50' }}>
                            <CheckCircle size={20} />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{ticket.subject}</Typography>
                            {getStatusChip(ticket.status)}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography component="span" variant="body2" sx={{ color: emerald.main, fontWeight: 500 }}>
                              {ticket.user}
                            </Typography>
                            <Typography variant="body2" sx={{ my: 1, color: theme.palette.text.primary }}>
                              {ticket.message}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                bgcolor: alpha(theme.palette.divider, 0.1),
                                py: 0.5,
                                px: 1,
                                borderRadius: 1,
                                display: 'inline-block'
                              }}
                            >
                              {ticket.date}
                            </Typography>
                            {ticket.resolution && (
                              <Box 
                                sx={{ 
                                  mt: 1.5, 
                                  p: 1.5, 
                                  bgcolor: alpha('#4caf50', 0.05), 
                                  borderRadius: 1, 
                                  borderLeft: `3px solid #4caf50` 
                                }}
                              >
                                <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                                  <CheckCircle size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                                  Resolution: {ticket.resolution}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < supportTickets.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                  </Box>
                ))
              )}
            </List>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 600,
                mb: 2
              }}
            >
              <MessageSquare size={20} color={emerald.main} style={{ marginRight: '8px' }} />
              User Feedback
            </Typography>
            <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
              {feedbackItems.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No feedback available</Typography>
                </Box>
              ) : (
                feedbackItems.map((feedback, index) => (
                  <Box key={feedback.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: alpha(emerald.light, 0.05) 
                        },
                        borderRadius: 1
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: emerald.dark }}>
                              {feedback.user}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star size={16} fill={getRatingColor(feedback.rating)} stroke={getRatingColor(feedback.rating)} />
                              <Typography variant="body2" sx={{ fontWeight: 500, color: getRatingColor(feedback.rating) }}>
                                {feedback.rating}/5
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box 
                              sx={{ 
                                my: 1, 
                                p: 1.5, 
                                bgcolor: alpha(theme.palette.background.default, 0.7), 
                                borderRadius: 1,
                                borderLeft: `3px solid ${alpha(getRatingColor(feedback.rating), 0.5)}`,
                                fontStyle: 'italic'
                              }}
                            >
                              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                "{feedback.message}"
                              </Typography>
                            </Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                bgcolor: alpha(theme.palette.divider, 0.1),
                                py: 0.5,
                                px: 1,
                                borderRadius: 1,
                                display: 'inline-block'
                              }}
                            >
                              {feedback.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < feedbackItems.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                  </Box>
                ))
              )}
            </List>
          </Box>
        )}
      </Paper>

      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.divider, 0.2)}`
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MessageCircle size={20} color={emerald.main} style={{ marginRight: '8px' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: emerald.dark }}>
              Respond to Support Ticket
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div" sx={{ mb: 2 }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.7), borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ticket from:
              </Typography> 
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: emerald.main }}>
                {selectedTicket?.user}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Subject:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                {selectedTicket?.subject}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Message:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedTicket?.message}
              </Typography>
            </Box>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your Response"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: emerald.main,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: emerald.main,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDialogClose}
            sx={{ 
              color: theme.palette.text.secondary,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCloseTicket} 
            variant="contained"
            disabled={!responseText}
            sx={{ 
              bgcolor: emerald.main, 
              '&:hover': { bgcolor: emerald.dark },
              '&.Mui-disabled': { bgcolor: alpha(emerald.main, 0.5) },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: `0 4px 10px 0 ${alpha(emerald.main, 0.3)}`,
            }}
          >
            Resolve Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackSupport;
