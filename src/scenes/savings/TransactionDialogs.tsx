import React, { useState } from 'react';
import {
  Dialog,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Fade
} from "@mui/material";
import { X, Target, Plus, Minus } from 'lucide-react';
import { useDepositToPotMutation, useWithdrawFromPotMutation } from "@/state/api";
import { Pot } from '@/types/pots';
import { POT_CATEGORIES } from '@/constants/potCategories';
import GoalCompletionCelebration from '@/components/GoalCompletionCelebration';

interface TransactionDialogProps {
  type: 'deposit' | 'withdraw' | 'goal';  // Updated type definition
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  selectedPot: Pot | null;
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  type,
  open,
  onClose,
  onSuccess,
  selectedPot,
  amount,
  onAmountChange
}) => {
  const [depositToPot] = useDepositToPotMutation();
  const [withdrawFromPot] = useWithdrawFromPotMutation();
  const [showCelebration, setShowCelebration] = useState(false);
  
  const category = POT_CATEGORIES.find(c => c.id === selectedPot?.category);

  const dialogConfig = {
    deposit: {
      title: 'Add Money',
      icon: <Plus size={20} />,
      color: '#10B981',
      label: 'Amount to Add (₹)',
      buttonText: 'Add Money',
      action: async () => {
        await depositToPot({ id: selectedPot?._id, amount }).unwrap();
        if (selectedPot?.goalAmount && 
            (selectedPot.balance + Number(amount)) >= selectedPot.goalAmount) {
          setShowCelebration(true);
        } else {
          onSuccess(`Successfully added ₹${amount} to ${selectedPot?.name}`);
          onClose();
        }
      }
    },
    withdraw: {
      title: 'Withdraw Money',
      icon: <Minus size={20} />,
      color: '#EF4444',
      label: 'Amount to Withdraw (₹)',
      buttonText: 'Withdraw Money',
      action: async () => {
        await withdrawFromPot({ id: selectedPot?._id, amount }).unwrap();
        onSuccess(`Successfully withdrawn ₹${amount} from ${selectedPot?.name}`);
        onClose();
      }
    },
    goal: {
      title: 'Set Goal',
      icon: <Target size={20} />,
      color: '#6366F1',
      label: 'Goal Amount (₹)',
      buttonText: 'Set Goal',
      action: async () => {
        onClose();
      }
    }
  };

  // Ensure we have a valid type
  const config = dialogConfig[type] || dialogConfig.deposit;

  const handleAction = async () => {
    try {
      if (!selectedPot?._id || amount <= 0) return;
      await config.action();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      onSuccess(error?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'visible'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 2 
        }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: `${config.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color
          }}>
            {config.icon}
          </Box>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
            {config.title}
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              bgcolor: 'grey.50',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        {/* Pot Info */}
        <Box sx={{ 
          p: 2.5, 
          mb: 3, 
          bgcolor: '#F8FAFC',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h3">{category?.icon}</Typography>
            <Box>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 600 }}>
                {selectedPot?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category?.name} Pot
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current Balance
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                ₹{selectedPot?.balance.toLocaleString()}
              </Typography>
            </Box>
            {selectedPot?.goalAmount > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Goal Amount
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ₹{selectedPot.goalAmount.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Amount Input */}
        <TextField
          fullWidth
          name="amount"
          label={config.label}
          type="number"
          variant="outlined"
          value={amount === 0 ? '' : amount} // Changed this line
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              onAmountChange({ ...e, target: { ...e.target, value: '0' } });
            } else if (Number(value) >= 0) {
              onAmountChange(e);
            }
          }}
          onFocus={(e) => e.target.select()} // Add this line to select all text on focus
          inputProps={{ 
            min: 0,
            step: "any",
            inputMode: "numeric",
            pattern: "[0-9]*",
            ...(type === 'withdraw' && { max: selectedPot?.balance })
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            },
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            },
            '& input[type=number]': {
              '-moz-appearance': 'textfield'
            }
          }}
          autoComplete="off"
          placeholder="Enter amount"
        />

        {/* Action Button */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleAction}
          disabled={amount <= 0 || (type === 'withdraw' && amount > (selectedPot?.balance || 0))}
          sx={{
            bgcolor: config.color,
            borderRadius: 2,
            py: 1.5,
            '&:hover': {
              bgcolor: config.color,
              filter: 'brightness(0.9)'
            }
          }}
        >
          {config.buttonText}
        </Button>
      </Box>
      {showCelebration && selectedPot && (
        <GoalCompletionCelebration
          potName={selectedPot.name}
          goalAmount={selectedPot.goalAmount}
          onComplete={() => {
            setShowCelebration(false);
            onClose();
            onSuccess(`Successfully added ₹${amount} to ${selectedPot.name} and completed your goal!`);
          }}
        />
      )}
    </Dialog>
  );
};

export default TransactionDialog;
