import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useWithdrawFromPotMutation } from "@/state/api";
import { Pot } from '@/types/pots';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  selectedPot: Pot | null;
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  open,
  onClose,
  onSuccess,
  selectedPot,
  amount,
  onAmountChange
}) => {
  const [withdrawFromPot] = useWithdrawFromPotMutation();

  const handleWithdraw = async () => {
    try {
      if (!selectedPot?._id) return;
      
      await withdrawFromPot({
        id: selectedPot._id,
        amount
      }).unwrap();
      onSuccess(`Successfully withdrawn ₹${amount} from ${selectedPot?.name}`);
      onClose();
    } catch (error) {
      console.error('Error withdrawing from pot:', error);
      onSuccess(error?.data?.message || 'Failed to withdraw money');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Withdraw from {selectedPot?.name}</DialogTitle>
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
          inputProps={{ max: selectedPot?.balance }}
          helperText={`Available balance: ₹${selectedPot?.balance.toLocaleString()}`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleWithdraw}
          disabled={amount <= 0 || (selectedPot && amount > selectedPot.balance)}
          variant="contained"
        >
          Withdraw
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawDialog;
