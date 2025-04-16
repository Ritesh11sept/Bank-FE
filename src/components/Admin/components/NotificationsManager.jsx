import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import { Trash2, Edit, BellRing, Plus } from 'lucide-react';

const NotificationsManager = () => {
  const theme = useTheme();
  const emerald = {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff'
  };
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Maintenance', message: 'System will be down for maintenance on Saturday', type: 'info', target: 'all' },
    { id: 2, title: 'New Feature Available', message: 'Check out our new budgeting tools', type: 'feature', target: 'all' },
    { id: 3, title: 'Important Security Update', message: 'Please update your password', type: 'warning', target: 'premium' }
  ]);
  
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editMode) {
      setNotifications(notifications.map(note => 
        note.id === currentId ? { ...newNotification, id: currentId } : note
      ));
      setEditMode(false);
      setCurrentId(null);
    } else {
      const id = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
      setNotifications([...notifications, { ...newNotification, id }]);
    }
    setNewNotification({ title: '', message: '', type: 'info', target: 'all' });
    setDialogOpen(false);
  };

  const handleEdit = (notification) => {
    setNewNotification(notification);
    setEditMode(true);
    setCurrentId(notification.id);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNewNotification({ title: '', message: '', type: 'info', target: 'all' });
    setEditMode(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return emerald.light;
      case 'warning': return '#f59e0b';
      case 'feature': return emerald.main;
      default: return emerald.light;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BellRing size={24} color={emerald.main} style={{ marginRight: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>System Notifications</Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<Plus size={18} />}
                onClick={openDialog}
                sx={{ 
                  bgcolor: emerald.main, 
                  '&:hover': { 
                    bgcolor: emerald.dark 
                  },
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  boxShadow: `0 4px 10px 0 ${alpha(emerald.main, 0.3)}`
                }}
              >
                Create Notification
              </Button>
            </Box>

            <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
              {notifications.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No notifications created yet</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Plus size={18} />} 
                    onClick={openDialog}
                    sx={{ 
                      mt: 2, 
                      borderColor: emerald.main, 
                      color: emerald.main,
                      '&:hover': { borderColor: emerald.dark, color: emerald.dark },
                      borderRadius: '8px',
                      textTransform: 'none'
                    }}
                  >
                    Create your first notification
                  </Button>
                </Box>
              ) : (
                notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: alpha(emerald.light, 0.05) 
                        }
                      }}
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleEdit(notification)}
                            sx={{ 
                              color: theme.palette.text.secondary,
                              '&:hover': { color: emerald.main, bgcolor: alpha(emerald.light, 0.1) }
                            }}
                          >
                            <Edit size={18} />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDelete(notification.id)}
                            sx={{ 
                              color: theme.palette.text.secondary,
                              '&:hover': { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.light, 0.1) },
                              ml: 1
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%', 
                                bgcolor: getTypeColor(notification.type), 
                                mr: 1.5 
                              }} 
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {notification.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1, ml: 2.5 }}>
                            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: emerald.main,
                              bgcolor: alpha(emerald.light, 0.1),
                              py: 0.5,
                              px: 1,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}>
                              {notification.target === 'all' ? 'All Users' : 'Premium Users Only'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                  </Box>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog} 
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: emerald.dark }}>
            {editMode ? 'Edit Notification' : 'Create New Notification'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newNotification.title}
              onChange={handleInputChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                mb: 2,
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
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={newNotification.message}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
              sx={{
                mb: 2,
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
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel sx={{ '&.Mui-focused': { color: emerald.main } }}>Notification Type</InputLabel>
              <Select
                name="type"
                value={newNotification.type}
                onChange={handleInputChange}
                label="Notification Type"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&.Mui-focused': {
                      borderColor: emerald.main,
                    },
                  }
                }}
              >
                <MenuItem value="info">Informational</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="feature">New Feature</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ '&.Mui-focused': { color: emerald.main } }}>Target Users</InputLabel>
              <Select
                name="target"
                value={newNotification.target}
                onChange={handleInputChange}
                label="Target Users"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&.Mui-focused': {
                      borderColor: emerald.main,
                    },
                  }
                }}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="premium">Premium Users Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeDialog}
            sx={{ 
              color: theme.palette.text.secondary,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { bgcolor: alpha(theme.palette.divider, 0.1) },
              borderRadius: '8px',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!newNotification.title || !newNotification.message}
            sx={{ 
              bgcolor: emerald.main, 
              '&:hover': { bgcolor: emerald.dark },
              '&.Mui-disabled': { bgcolor: alpha(emerald.main, 0.5) },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: `0 4px 10px 0 ${alpha(emerald.main, 0.3)}`,
              px: 3
            }}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsManager;
