import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useUpdatePotGoalMutation } from "@/state/api";
import { Pot } from '@/types/pots';

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

  const handleSetGoal = async () => {
    try {
      if (!selectedPot?._id) return;
      
      await updatePotGoal({
        id: selectedPot._id,
        goalAmount
      }).unwrap();
      onSuccess('Goal amount set successfully!');
      onClose();
    } catch (error) {
      console.error('Error setting goal:', error);
      onSuccess(error?.data?.message || 'Failed to set goal');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedPot?.goalAmount ? 'Update' : 'Set'} Goal for {selectedPot?.name}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="goalAmount"
          label="Goal Amount (₹)"
          type="number"
          fullWidth
          variant="outlined"
          value={goalAmount}
          onChange={onGoalAmountChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSetGoal}
          disabled={goalAmount <= 0}
          variant="contained"
        >
          {selectedPot?.goalAmount ? 'Update' : 'Set'} Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetGoalDialog;
