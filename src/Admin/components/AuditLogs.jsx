import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
  alpha,
  Tooltip,
  IconButton,
  Fade
} from '@mui/material';
import { Search, Download, Calendar, User, Filter, RefreshCcw } from 'lucide-react';

// Custom component for the styled Paper
const StyledPanel = ({ children, ...props }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      borderRadius: '12px',
      border: '1px solid',
      borderColor: alpha('#10B981', 0.2),
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fdfb 100%)',
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Paper>
);

const AuditLogs = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  });
  const [filterVisible, setFilterVisible] = useState(false);

  // Sample audit log data
  const [logs] = useState([
    { id: 1, timestamp: '2023-11-02 14:32:10', user: 'admin@bank.com', action: 'LOGIN', details: 'Admin login successful', ip: '192.168.1.1' },
    { id: 2, timestamp: '2023-11-02 14:35:22', user: 'admin@bank.com', action: 'USER_UPDATE', details: 'Updated user status for user123@example.com', ip: '192.168.1.1' },
    { id: 3, timestamp: '2023-11-02 15:10:45', user: 'admin@bank.com', action: 'NOTIFICATION_CREATE', details: 'Created system notification "System Maintenance"', ip: '192.168.1.1' },
    { id: 4, timestamp: '2023-11-01 09:22:33', user: 'admin@bank.com', action: 'USER_CREATE', details: 'Created new user account for newuser@example.com', ip: '192.168.1.1' },
    { id: 5, timestamp: '2023-11-01 09:45:12', user: 'admin@bank.com', action: 'SETTINGS_UPDATE', details: 'Updated system settings', ip: '192.168.1.1' },
    { id: 6, timestamp: '2023-10-31 16:18:05', user: 'support@bank.com', action: 'TICKET_CLOSE', details: 'Closed support ticket #1258', ip: '192.168.1.2' },
    { id: 7, timestamp: '2023-10-31 11:42:30', user: 'admin@bank.com', action: 'LOGIN', details: 'Admin login successful', ip: '192.168.1.1' },
    { id: 8, timestamp: '2023-10-30 14:05:22', user: 'support@bank.com', action: 'LOGIN', details: 'Support login successful', ip: '192.168.1.2' },
    { id: 9, timestamp: '2023-10-30 14:15:42', user: 'support@bank.com', action: 'USER_VIEW', details: 'Viewed user details for user456@example.com', ip: '192.168.1.2' },
    { id: 10, timestamp: '2023-10-30 10:22:18', user: 'admin@bank.com', action: 'LOGOUT', details: 'Admin logout', ip: '192.168.1.1' },
    { id: 11, timestamp: '2023-10-29 16:30:25', user: 'admin@bank.com', action: 'REPORT_EXPORT', details: 'Exported monthly transaction report', ip: '192.168.1.1' },
    { id: 12, timestamp: '2023-10-29 09:15:32', user: 'admin@bank.com', action: 'LOGIN', details: 'Admin login successful', ip: '192.168.1.1' },
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = !filter.action || log.action === filter.action;
    const matchesUser = !filter.user || log.user.includes(filter.user);
    const logDate = new Date(log.timestamp);
    
    const matchesDateFrom = !filter.dateFrom || 
      logDate >= new Date(filter.dateFrom);
    
    const matchesDateTo = !filter.dateTo || 
      logDate <= new Date(filter.dateTo + 'T23:59:59');
    
    return matchesAction && matchesUser && matchesDateFrom && matchesDateTo;
  });

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return '#10B981'; // emerald
      case 'USER_CREATE':
      case 'USER_UPDATE':
        return '#059669'; // dark emerald
      case 'NOTIFICATION_CREATE':
        return '#8B5CF6'; // purple
      case 'SETTINGS_UPDATE':
        return '#F59E0B'; // amber
      case 'TICKET_CLOSE':
        return '#6B7280'; // gray
      case 'REPORT_EXPORT':
        return '#3B82F6'; // blue
      case 'USER_VIEW':
        return '#6EE7B7'; // light emerald
      default:
        return '#64748B'; // slate
    }
  };

  const handleExportLogs = () => {
    // Logic to export logs would go here
    alert('Exporting logs functionality would be implemented here');
  };

  return (
    <Box>
      <StyledPanel>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#064E3B',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40px',
                height: '3px',
                backgroundColor: '#10B981',
                borderRadius: '2px'
              }
            }}
          >
            System Audit Logs
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Toggle filters" placement="top">
              <IconButton 
                onClick={() => setFilterVisible(!filterVisible)}
                sx={{ 
                  color: filterVisible ? '#10B981' : '#64748B',
                  '&:hover': {
                    bgcolor: alpha('#10B981', 0.1)
                  }
                }}
              >
                <Filter size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh logs" placement="top">
              <IconButton 
                sx={{ 
                  color: '#64748B',
                  '&:hover': {
                    bgcolor: alpha('#10B981', 0.1),
                    color: '#10B981'
                  }
                }}
              >
                <RefreshCcw size={20} />
              </IconButton>
            </Tooltip>
            <Button 
              variant="outlined" 
              startIcon={<Download size={18} />}
              onClick={handleExportLogs}
              sx={{ 
                borderColor: '#10B981',
                color: '#10B981',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#059669',
                  backgroundColor: alpha('#10B981', 0.04)
                },
                transition: 'all 0.2s ease'
              }}
            >
              Export Logs
            </Button>
          </Box>
        </Box>

        <Fade in={filterVisible}>
          <Box sx={{ mb: filterVisible ? 3 : 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: alpha('#F3F4F6', 0.5),
                borderRadius: '8px'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel 
                      sx={{ 
                        '&.Mui-focused': { 
                          color: '#10B981' 
                        } 
                      }}
                    >
                      Action Type
                    </InputLabel>
                    <Select
                      name="action"
                      value={filter.action}
                      onChange={handleFilterChange}
                      label="Action Type"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#10B981', 0.2),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#10B981',
                        },
                      }}
                    >
                      <MenuItem value="">All Actions</MenuItem>
                      <MenuItem value="LOGIN">Login</MenuItem>
                      <MenuItem value="LOGOUT">Logout</MenuItem>
                      <MenuItem value="USER_CREATE">User Create</MenuItem>
                      <MenuItem value="USER_UPDATE">User Update</MenuItem>
                      <MenuItem value="USER_VIEW">User View</MenuItem>
                      <MenuItem value="NOTIFICATION_CREATE">Notification Create</MenuItem>
                      <MenuItem value="SETTINGS_UPDATE">Settings Update</MenuItem>
                      <MenuItem value="TICKET_CLOSE">Ticket Close</MenuItem>
                      <MenuItem value="REPORT_EXPORT">Report Export</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="User"
                    name="user"
                    value={filter.user}
                    onChange={handleFilterChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={18} color="#64748B" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#10B981', 0.2),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#10B981', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10B981',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#10B981',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="From Date"
                    type="date"
                    name="dateFrom"
                    value={filter.dateFrom}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={18} color="#64748B" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#10B981', 0.2),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#10B981', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10B981',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#10B981',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="To Date"
                    type="date"
                    name="dateTo"
                    value={filter.dateTo}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={18} color="#64748B" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: alpha('#10B981', 0.2),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#10B981', 0.3),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10B981',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#10B981',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Search size={18} />}
                    sx={{ 
                      height: '40px',
                      bgcolor: '#10B981',
                      '&:hover': {
                        bgcolor: '#059669',
                      },
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Fade>

        <TableContainer 
          sx={{ 
            borderRadius: '8px',
            border: '1px solid',
            borderColor: alpha('#E5E7EB', 0.8),
            backgroundColor: '#FFFFFF',
            overflow: 'hidden'
          }}
        >
          <Table size="small">
            <TableHead
              sx={{
                backgroundColor: alpha('#F3F4F6', 0.5),
                borderBottom: '2px solid',
                borderBottomColor: alpha('#E5E7EB', 0.8),
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#374151', py: 1.5 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', py: 1.5 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', py: 1.5 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', py: 1.5 }}>Details</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', py: 1.5 }}>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow 
                  key={log.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: alpha('#F9FAFB', 0.6) 
                    },
                    '&:hover': { 
                      backgroundColor: alpha('#10B981', 0.04) 
                    },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>{log.timestamp}</TableCell>
                  <TableCell sx={{ py: 1.5 }}>{log.user}</TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip 
                      label={log.action.replace(/_/g, ' ')} 
                      size="small" 
                      sx={{ 
                        bgcolor: getActionColor(log.action), 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        height: '22px',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>{log.details}</TableCell>
                  <TableCell sx={{ py: 1.5, color: '#64748B', fontFamily: 'monospace' }}>{log.ip}</TableCell>
                </TableRow>
              ))}
              {paginatedLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No audit logs match your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-select': {
              '&:focus': {
                backgroundColor: alpha('#10B981', 0.1)
              }
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#64748B'
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#4B5563'
            },
            '& .MuiIconButton-root.Mui-disabled': {
              color: alpha('#4B5563', 0.3)
            },
            '& .MuiIconButton-root': {
              color: '#4B5563',
              '&:hover': {
                backgroundColor: alpha('#10B981', 0.1)
              }
            }
          }}
        />
      </StyledPanel>
    </Box>
  );
};

export default AuditLogs;
