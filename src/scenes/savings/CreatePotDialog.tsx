import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Button,
  TextField,
  Fade,
  Container
} from "@mui/material";
import { X, ChevronLeft } from 'lucide-react';
import { useCreatePotMutation } from "@/state/api";
import { POT_CATEGORIES } from '@/constants/potCategories';
import SuccessAnimation from '@/components/SuccessAnimation';

interface CreatePotDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const CategoryCard = ({ category, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 3,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      bgcolor: 'white',
      borderRadius: 3,
      border: '2px solid transparent',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: '#10B981',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)'
      }
    }}
  >
    <Box
      sx={{
        mb: 2,
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#10B98115',
        color: '#10B981'
      }}
    >
      <Typography variant="h3" sx={{ fontSize: '2.5rem' }}>
        {category.icon}
      </Typography>
    </Box>
    <Typography 
      variant="subtitle1" 
      sx={{ 
        color: '#10B981',
        fontWeight: 700,
        mb: 1,
        fontSize: '1.1rem'
      }}
    >
      {category.name}
    </Typography>
    {category.description && (
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          fontSize: '0.9rem',
          lineHeight: 1.4
        }}
      >
        {category.description}
      </Typography>
    )}
  </Paper>
);

const CreatePotDialog: React.FC<CreatePotDialogProps> = ({ 
  open, 
  onClose, 
  onSuccess,
  potCategories 
}) => {
  const [createPot] = useCreatePotMutation();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [potName, setPotName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    setStep(1);
    setSelectedCategory('');
    setPotName('');
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPot({
        name: potName,
        category: selectedCategory
      }).unwrap();
      setShowSuccess(true);
      // Success message will be shown via animation
      setTimeout(() => {
        handleClose();
        onSuccess('Pot created successfully!');
      }, 2000);
    } catch (error) {
      console.error('Error creating pot:', error);
      onSuccess('Failed to create pot');
    }
  };

  if (showSuccess) {
    return (
      <SuccessAnimation
        title="Pot Created Successfully! 🎉"
        subtitle="Your new savings journey begins now"
        onComplete={() => {
          setShowSuccess(false);
          onClose();
          onSuccess('New savings pot created successfully');
        }}
      />
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth={step === 1 ? "md" : "sm"}
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: step === 1 ? '#F8FAFC' : 'transparent',
          boxShadow: step === 1 ? undefined : 'none',
        }
      }}
    >
      {step === 1 ? (
        // Category selection step
        <Box>
          <Box sx={{ 
            p: 2,
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            {step === 2 && (
              <IconButton 
                onClick={() => setStep(1)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#F1F5F9'
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              {step === 1 ? 'Choose Pot Category' : 'Name Your Pot'}
            </Typography>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                '&:hover': { 
                  bgcolor: '#F1F5F9'
                }
              }}
            >
              <X />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'center', 
                mb: 1,
                fontWeight: 700
              }}
            >
              What are you saving for?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center',
                mb: 4
              }}
            >
              Choose a category for your savings pot
            </Typography>
            <Grid container spacing={2.5}>
              {POT_CATEGORIES.map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.id}>
                  <CategoryCard
                    category={category}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setStep(2);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        // Name your pot step
        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box sx={{ 
              p: 2,
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}>
              <IconButton 
                onClick={() => setStep(1)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#F1F5F9'
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                Name Your Pot
              </Typography>
              <IconButton onClick={handleClose}>
                <X />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              {/* Selected Category Preview */}
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    bgcolor: '#10B98115',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h2">
                    {POT_CATEGORIES.find(c => c.id === selectedCategory)?.icon}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {POT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Pot
                </Typography>
              </Box>

              {/* Input Field */}
              <TextField
                fullWidth
                label="Name your pot"
                value={potName}
                onChange={(e) => setPotName(e.target.value)}
                variant="outlined"
                placeholder="e.g., Dream Holiday"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    bgcolor: 'white',
                    fontSize: '1.1rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10B981'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10B981'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '1.1rem'
                  }
                }}
                sx={{ mb: 3 }}
              />

              {/* Action Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!potName}
                sx={{
                  background: 'linear-gradient(to right, #10B981, #059669)',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(to right, #059669, #047857)'
                  }
                }}
              >
                Create {POT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Pot
              </Button>
            </Box>
          </Paper>
        </Container>
      )}
    </Dialog>
  );
};

export default CreatePotDialog;