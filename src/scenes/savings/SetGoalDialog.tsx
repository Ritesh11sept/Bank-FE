import React from 'react';
import {
  Dialog,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Fade
} from "@mui/material";
import { X, Target } from 'lucide-react';
import { useUpdatePotGoalMutation } from "@/state/api";
import { Pot } from '@/types/pots';
import { POT_CATEGORIES } from '@/constants/potCategories';

interface SetGoalDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  selectedPot: Pot | null;
  goalAmount: number;
  onGoalAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SetGoalDialog: React.FC<SetGoalDialogProps> = ({
  open,
  onClose,
  onSuccess,
  selectedPot,
  goalAmount,
  onGoalAmountChange
}) => {
  const [updatePotGoal] = useUpdatePotGoalMutation();
  const category = POT_CATEGORIES.find(c => c.id === selectedPot?.category);

  const handleSubmit = async () => {
    try {
      if (!selectedPot?._id || goalAmount <= 0) return;
      
      await updatePotGoal({
        potId: selectedPot._id,
        data: { goalAmount: Number(goalAmount) }
      }).unwrap();
      
      onSuccess(`Goal ${selectedPot.goalAmount ? 'updated' : 'set'} successfully!`);
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
            bgcolor: '#10B98115',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <Target size={20} />
          </Box>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
            {selectedPot?.goalAmount ? 'Update Goal' : 'Set Goal'}
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
          <Box>
            <Typography variant="body2" color="text.secondary">
              Current Balance
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              ₹{selectedPot?.balance.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Goal Amount Input - Updated Code */}
        <TextField
          fullWidth
          name="goalAmount"
          label="Goal Amount (₹)"
          type="number"
          variant="outlined"
          value={goalAmount === 0 ? '' : goalAmount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              onGoalAmountChange({ ...e, target: { ...e.target, value: '0', name: 'goalAmount' } });
            } else if (Number(value) >= 0) {
              onGoalAmountChange({ ...e, target: { ...e.target, name: 'goalAmount' } });
            }
          }}
          onFocus={(e) => e.target.select()}
          inputProps={{ 
            min: 0,
            step: "any",
            inputMode: "numeric",
            pattern: "[0-9]*"
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
          placeholder="Enter goal amount"
        />

        {/* Action Button */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
          disabled={!goalAmount || goalAmount <= 0}
          sx={{
            bgcolor: '#10B981',
            borderRadius: 2,
            py: 1.5,
            '&:hover': {
              bgcolor: '#059669'
            }
          }}
        >
          {selectedPot?.goalAmount ? 'Update Goal' : 'Set Goal'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SetGoalDialog;
