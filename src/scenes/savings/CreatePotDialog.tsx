import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  MenuItem,
  Select
} from "@mui/material";
import { useCreatePotMutation } from "@/state/api";
import { PotCategory } from '@/types/pots';

interface CreatePotDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  potCategories: PotCategory[];
}

const CreatePotDialog: React.FC<CreatePotDialogProps> = ({
  open,
  onClose,
  onSuccess,
  potCategories
}) => {
  const [createPot] = useCreatePotMutation();
  const [formData, setFormData] = useState({
    name: '',
    category: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleCreatePot = async () => {
    try {
      await createPot({
        name: formData.name,
        category: formData.category
      }).unwrap();
      onSuccess('Pot created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating pot:', error);
      onSuccess('Failed to create pot');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', category: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Pot</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Pot Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <Select
          fullWidth
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Select Category
          </MenuItem>
          {potCategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleCreatePot}
          disabled={!formData.name || !formData.category}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePotDialog;
