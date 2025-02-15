import React, { useState } from 'react';
import { Dialog, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:9000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pan, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="PAN Number"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            required
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Login
          </Button>
        </form>
      </div>
    </Dialog>
  );
};

export default LoginModal;
