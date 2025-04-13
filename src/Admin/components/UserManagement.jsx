import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search,
  Eye,
  Ban,
  UserPlus,
  Edit,
  Trash,
  MoreVertical,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { useGetUserDetailsQuery, useToggleUserStatusMutation } from '../../state/api';

const UserManagement = ({ usersData = [] }) => {
  const theme = useTheme();
  const emerald = {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff'
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);

  const { data: userDetails, isLoading: loadingDetails } = useGetUserDetailsQuery(
    selectedUser?.id,
    { skip: !selectedUser }
  );

  const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

  const users = usersData.length > 0 ? usersData : [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', type: 'standard', joinDate: '2023-01-15', lastLogin: '2023-06-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', type: 'premium', joinDate: '2023-02-20', lastLogin: '2023-06-12' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', status: 'inactive', type: 'standard', joinDate: '2023-03-05', lastLogin: '2023-05-28' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'suspended', type: 'standard', joinDate: '2023-01-30', lastLogin: '2023-04-15' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', status: 'active', type: 'premium', joinDate: '2023-04-10', lastLogin: '2023-06-11' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = 
      (selectedTab === 0) || 
      (selectedTab === 1 && user.status === 'active') || 
      (selectedTab === 2 && user.status === 'inactive') || 
      (selectedTab === 3 && user.status === 'suspended');
      
    return matchesSearch && matchesTab;
  });

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await toggleUserStatus({ userId, status: newStatus }).unwrap();
      setUserDetailOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return emerald.main;
      case 'inactive':
        return '#f59e0b';
      case 'suspended':
        return '#ef4444';
      default:
        return 'default';
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'premium':
        return emerald.main;
      case 'standard':
        return '#3b82f6';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
            <UserCheck size={24} color={emerald.main} style={{ marginRight: '10px' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>User Management</Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshCw size={18} />}
            size="small"
            sx={{ 
              borderColor: emerald.main, 
              color: emerald.main,
              '&:hover': { 
                borderColor: emerald.dark, 
                color: emerald.dark,
                bgcolor: alpha(emerald.light, 0.05)
              },
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Refresh
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ 
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: emerald.main,
                },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color={alpha(theme.palette.text.secondary, 0.7)} />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            startIcon={<UserPlus size={18} />}
            sx={{ 
              bgcolor: emerald.main, 
              '&:hover': { 
                bgcolor: emerald.dark 
              },
              borderRadius: '8px',
              px: 2,
              textTransform: 'none',
              boxShadow: `0 4px 10px 0 ${alpha(emerald.main, 0.3)}`
            }}
          >
            Add User
          </Button>
        </Box>
        
        <Tabs 
          value={selectedTab} 
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
              minWidth: 80,
              '&.Mui-selected': {
                color: emerald.main,
              },
            },
          }}
        >
          <Tab label="All Users" />
          <Tab label="Active" />
          <Tab label="Inactive" />
          <Tab label="Suspended" />
        </Tabs>
        
        <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead sx={{ bgcolor: alpha(emerald.light, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: alpha(emerald.light, 0.03) },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} 
                        size="small"
                        sx={{ 
                          bgcolor: alpha(getStatusColor(user.status), 0.1), 
                          color: getStatusColor(user.status),
                          fontWeight: 500,
                          border: 'none'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.type.charAt(0).toUpperCase() + user.type.slice(1)} 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: getUserTypeColor(user.type),
                          color: getUserTypeColor(user.type),
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={() => openUserDetail(user)} 
                        sx={{ 
                          color: emerald.main,
                          '&:hover': { bgcolor: alpha(emerald.light, 0.1) },
                          mx: 0.5
                        }}
                      >
                        <Eye size={16} />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#3b82f6',
                          '&:hover': { bgcolor: alpha('#3b82f6', 0.1) },
                          mx: 0.5
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: '#ef4444',
                          '&:hover': { bgcolor: alpha('#ef4444', 0.1) },
                          mx: 0.5
                        }}
                      >
                        <Ban size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-selectIcon': { color: emerald.main },
            '.MuiTablePagination-actions button:hover': { bgcolor: alpha(emerald.light, 0.1) },
            '.MuiTablePagination-actions button': { color: emerald.main }
          }}
        />
      </Paper>
      
      <Dialog 
        open={userDetailOpen} 
        onClose={() => setUserDetailOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.divider, 0.2)}`
          }
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UserCheck size={22} color={emerald.main} style={{ marginRight: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: emerald.dark }}>
                  User Details: {selectedUser.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {loadingDetails ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography>Loading user details...</Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Basic Information</Typography>
                    <Chip 
                      label={selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)} 
                      sx={{ 
                        bgcolor: alpha(getStatusColor(selectedUser.status), 0.1), 
                        color: getStatusColor(selectedUser.status),
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 3, 
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.5)
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: getUserTypeColor(selectedUser.type) }}>
                        {selectedUser.type.charAt(0).toUpperCase() + selectedUser.type.slice(1)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.joinDate}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Account Activity</Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, mb: 3 }}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 20px 0 ${alpha(theme.palette.divider, 0.15)}`
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ color: emerald.main, fontWeight: 600 }}>15</Typography>
                      <Typography variant="body2" color="text.secondary">Transactions</Typography>
                    </Paper>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 20px 0 ${alpha(theme.palette.divider, 0.15)}`
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ color: emerald.main, fontWeight: 600 }}>3</Typography>
                      <Typography variant="body2" color="text.secondary">Savings Pots</Typography>
                    </Paper>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 20px 0 ${alpha(theme.palette.divider, 0.15)}`
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ color: emerald.main, fontWeight: 600 }}>72</Typography>
                      <Typography variant="body2" color="text.secondary">Wellness Score</Typography>
                    </Paper>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Account Actions</Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedUser.status === 'active'}
                          onChange={() => handleStatusChange(
                            selectedUser.id, 
                            selectedUser.status === 'active' ? 'inactive' : 'active'
                          )}
                          disabled={isToggling}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: emerald.main,
                              '&:hover': { backgroundColor: alpha(emerald.main, 0.1) },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: emerald.main,
                            },
                          }}
                        />
                      }
                      label="Account Active"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Ban size={18} />}
                      onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                      disabled={selectedUser.status === 'suspended' || isToggling}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Suspend Account
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Trash size={18} />}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: '#f43f5e',
                        color: '#f43f5e',
                        '&:hover': {
                          borderColor: '#e11d48',
                          color: '#e11d48',
                          bgcolor: alpha('#f43f5e', 0.05)
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setUserDetailOpen(false)}
                sx={{ 
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '8px',
                }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: emerald.main, 
                  '&:hover': { bgcolor: emerald.dark },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: `0 4px 10px 0 ${alpha(emerald.main, 0.3)}`,
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UserManagement;
