import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import DashboardLayout from "@/components/DashboardLayout";
import AddIcon from '@mui/icons-material/Add';
import { Pot, PotCategory } from '@/types/pots';
import { useGetPotsQuery, useDeletePotMutation } from "@/state/api";
import AboutPotsDialog from '@/components/AboutPotsDialog';
import CreatePotDialog from '@/scenes/savings/CreatePotDialog';
import DepositDialog from './savings/DepositDialog';
import WithdrawDialog from './savings/WithdrawDialog';
import SetGoalDialog from './savings/SetGoalDialog';
import PotGrid from './savings/PotGrid';

const potCategories: PotCategory[] = [
  { id: 'emergency', name: 'Emergency Fund', color: '#2196F3' },
  { id: 'travel', name: 'Travel', color: '#4CAF50' },
  { id: 'gadget', name: 'Gadget Upgrade', color: '#FF9800' },
  { id: 'vehicle', name: 'Vehicle', color: '#9C27B0' },
  { id: 'gift', name: 'Gift', color: '#F44336' },
  { id: 'custom', name: 'Custom', color: '#795548' }
];

const Pots = () => {
  const { data: pots = [], isLoading, error: queryError } = useGetPotsQuery();
  const [deletePot] = useDeletePotMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    goalAmount: 0
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleDeletePot = async (potId: string) => {
    if (window.confirm('Are you sure you want to delete this pot?')) {
      try {
        await deletePot(potId).unwrap();
        showAlert('Pot deleted successfully', 'success');
      } catch (error) {
        showAlert(error?.data?.message || 'Failed to delete pot', 'error');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = potCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Custom';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = potCategories.find(cat => cat.id === categoryId);
    return category ? category.color : '#757575';
  };

  return (
    <DashboardLayout>
      <Box
        width="100%"
        height="100%"
        p="1.5rem 2rem"
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <FlexBetween mb={3}>
          <Typography
            variant="h4"
            sx={{
              color: '#1E293B',
              fontWeight: 600
            }}
          >
            Savings Pots
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setIsAboutDialogOpen(true)}
              sx={{
                mr: 2,
                borderColor: '#6366F1',
                color: '#6366F1',
                '&:hover': { borderColor: '#4F46E5', color: '#4F46E5' }
              }}
            >
              About Pots
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{
                bgcolor: '#6366F1',
                '&:hover': { bgcolor: '#4F46E5' }
              }}
            >
              Create New Pot
            </Button>
          </Box>
        </FlexBetween>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create pots for specific goals and save money easily. Each pot earns 2.5% interest annually.
        </Typography>

        {isLoading ? (
          <DashboardBox sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Loading pots...</Typography>
          </DashboardBox>
        ) : queryError ? (
          <DashboardBox sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              {typeof queryError === 'string' ? queryError : 'Failed to load pots'}
            </Typography>
          </DashboardBox>
        ) : (
          <PotGrid
            pots={pots}
            onDeposit={(pot) => {
              setSelectedPot(pot);
              setFormData(prev => ({ ...prev, amount: 0 }));
              setIsDepositDialogOpen(true);
            }}
            onWithdraw={(pot) => {
              setSelectedPot(pot);
              setFormData(prev => ({ ...prev, amount: 0 }));
              setIsWithdrawDialogOpen(true);
            }}
            onSetGoal={(pot) => {
              setSelectedPot(pot);
              setFormData(prev => ({ ...prev, goalAmount: pot.goalAmount || 0 }));
              setIsGoalDialogOpen(true);
            }}
            onDelete={handleDeletePot}
            onCreateNew={() => setIsCreateDialogOpen(true)}
            getCategoryName={getCategoryName}
            getCategoryColor={getCategoryColor}
          />
        )}

        <CreatePotDialog 
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          potCategories={potCategories}
        />

        <DepositDialog
          open={isDepositDialogOpen}
          onClose={() => setIsDepositDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <WithdrawDialog
          open={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <SetGoalDialog
          open={isGoalDialogOpen}
          onClose={() => setIsGoalDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          goalAmount={formData.goalAmount}
          onGoalAmountChange={handleInputChange}
        />

        <AboutPotsDialog 
          open={isAboutDialogOpen}
          onClose={() => setIsAboutDialogOpen(false)}
        />

        <Snackbar 
          open={alert.open} 
          autoHideDuration={6000} 
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
            severity={alert.severity}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default Pots;