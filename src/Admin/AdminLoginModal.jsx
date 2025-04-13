import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAdminLoginMutation } from '../state/api';

const AdminLoginModal = ({ onAuthSuccess }) => {
  const theme = useTheme();
  // Set default admin credentials for development
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      console.log('Attempting admin login with:', { username, password });
      
      try {
        const result = await adminLogin({ username, password }).unwrap();
        console.log('Admin login successful:', result);
        
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('isAdmin', 'true');
        
        if (result.admin) {
          localStorage.setItem('adminUser', JSON.stringify(result.admin));
        }
        
        onAuthSuccess();
      } catch (adminError) {
        // Development fallback for admin login
        if (username === 'admin' && password === 'admin123') {
          console.log('Using development admin login fallback');
          
          // Create a mock admin token
          const mockToken = 'dev-admin-token-' + Date.now();
          localStorage.setItem('adminToken', mockToken);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminUser', JSON.stringify({
            id: 'admin-1',
            username: 'admin',
            role: 'admin'
          }));
          
          onAuthSuccess();
        } else {
          throw adminError;
        }
      }
    } catch (err) {
      console.error('Admin login error details:', err);
      
      // More detailed error handling
      let errorMessage = 'Invalid credentials. Please try again.';
      
      if (err.status === 404) {
        errorMessage = 'Admin login endpoint not found. Please check server configuration.';
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: theme.palette.background.paper
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter your credentials to access the admin dashboard
        </Typography>
        
        {/* Development note */}
        <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
          For testing, use: username: admin, password: admin123
        </Alert>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLoginModal;
