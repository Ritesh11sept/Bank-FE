import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useDepositToPotMutation } from "@/state/api";
import { Pot } from '@/types/pots';

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  selectedPot: Pot | null;
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({
  open,
  onClose,
  onSuccess,
  selectedPot,
  amount,
  onAmountChange
}) => {
  const [depositToPot] = useDepositToPotMutation();

  const handleDeposit = async () => {
    try {
      if (!selectedPot?._id) return;
      
      await depositToPot({
        id: selectedPot._id,
        amount
      }).unwrap();
      onSuccess(`Successfully added ₹${amount} to ${selectedPot?.name}`);
      onClose();
    } catch (error) {
      console.error('Error depositing to pot:', error);
      onSuccess(error?.data?.message || 'Failed to deposit money');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Deposit to {selectedPot?.name}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="amount"
          label="Amount (₹)"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={onAmountChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleDeposit}
          disabled={amount <= 0}
          variant="contained"
        >
          Deposit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepositDialog;
