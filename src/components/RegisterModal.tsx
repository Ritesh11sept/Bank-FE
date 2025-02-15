import React, { useState } from 'react';
import { Dialog, TextField, Button, Alert, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  balance: number;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedAccounts, setLinkedAccounts] = useState<BankAccount[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = async () => {
    setError('');

    // Basic validation
    if (!pan || pan.length !== 10) {
      setError('Please enter a valid PAN number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Fetching linked accounts for PAN:', pan);
      const response = await fetch('http://localhost:9000/user/getLinkedAccounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pan }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setLinkedAccounts(data.accounts);
        if (data.accounts.length === 0) {
          setError('No bank accounts found for this PAN');
          return;
        }
        setStep(2);
      } else {
        setError(data.message || 'Failed to fetch linked accounts');
      }
    } catch (err) {
      console.error('Error fetching linked accounts:', err);
      setError('Network error while fetching bank accounts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:9000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          pan, 
          phone 
        }),
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
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        {step === 1 ? (
          <form className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
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
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <TextField
              fullWidth
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              type="password"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Next
            </Button>
          </form>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Linked Bank Accounts</h3>
            <List className="mb-4">
              {linkedAccounts.map((account, index) => (
                <ListItem key={index} className="border rounded-lg mb-2">
                  <ListItemText
                    primary={account.bankName}
                    secondary={`Account: ${account.accountNumber} • IFSC: ${account.ifscCode}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default RegisterModal;
