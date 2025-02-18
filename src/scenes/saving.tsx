import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Grid } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Info } from 'lucide-react';
import { Pot } from '@/types/pots';
import { useGetPotsQuery, useDeletePotMutation } from "@/state/api";
import { POT_CATEGORIES } from '@/constants/potCategories';
import AboutPotsDialog from '@/components/AboutPotsDialog'; // Add this import
import CreatePotDialog from './savings/CreatePotDialog';
import TransactionDialog from './savings/TransactionDialogs';
import SetGoalDialog from './savings/SetGoalDialog';
import PotGrid from './savings/PotGrid';

// Create a reusable StatsCard component for better consistency
const StatsCard = ({ label, value }) => (
  <Box
    sx={{
      bgcolor: 'white',
      p: 2.5,
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
      }
    }}
  >
    <Typography 
      variant="body2" 
      sx={{ 
        mb: 1,
        color: 'text.secondary',
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      {label}
    </Typography>
    <Typography 
      variant="h5" 
      sx={{ 
        fontWeight: 700, 
        color: '#0F172A',
        fontSize: '1.25rem',
        lineHeight: 1.2
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Savings = () => {
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
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleDeletePot = async (potId: string) => {
    try {
      await deletePot(potId).unwrap();
      showAlert('Pot deleted successfully', 'success');
    } catch (error) {
      showAlert(error?.data?.message || 'Failed to delete pot', 'error');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = POT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Custom';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = POT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : '#757575';
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          p: { xs: "1.25rem", md: "1.75rem" },
          background: 'linear-gradient(to bottom, #F8FAFC, #F1F5F9)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Header Section */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#0F172A',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                mb: 0.5,
                letterSpacing: '-0.01em'
              }}
            >
              Savings Pots
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.9rem'
              }}
            >
              <Info size={16} />
              Each pot earns 2.5% interest annually
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            width: { xs: '100%', md: 'auto' }
          }}>
            <Button
              variant="outlined"
              onClick={() => setIsAboutDialogOpen(true)}
              sx={{
                borderColor: '#E2E8F0',
                color: '#64748B',
                bgcolor: 'white',
                borderRadius: '12px',
                px: 2.5,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#F8FAFC',
                  borderColor: '#CBD5E1'
                }
              }}
            >
              About Pots
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(to right, #10B981, #059669)',
                borderRadius: '12px',
                px: 2.5,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(to right, #059669, #047857)',
                  boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.3)'
                }
              }}
            >
              Create New Pot
            </Button>
          </Box>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              label="Total Savings"
              value={`₹${pots.reduce((sum, pot) => sum + pot.balance, 0).toLocaleString()}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              label="Active Pots"
              value={pots.length}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              label="Total Goals"
              value={pots.filter(pot => pot.goalAmount > 0).length}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              label="Interest Earned"
              value={`₹${(pots.reduce((sum, pot) => sum + pot.balance, 0) * 0.025).toFixed(2)}`}
            />
          </Grid>
        </Grid>

        {/* Main Content - Pots Grid */}
        {isLoading ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            bgcolor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography sx={{ 
              fontWeight: 500,
              color: 'text.secondary',
              fontSize: '0.9rem'
            }}>
              Loading your savings pots...
            </Typography>
          </Box>
        ) : queryError ? (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography color="error">
              {typeof queryError === 'string' ? queryError : 'Failed to load pots'}
            </Typography>
          </Box>
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

        {/* Dialogs */}
        <CreatePotDialog 
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          potCategories={POT_CATEGORIES}
        />

        <TransactionDialog 
          type="deposit"
          open={isDepositDialogOpen}
          onClose={() => setIsDepositDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <TransactionDialog 
          type="withdraw"
          open={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <TransactionDialog 
          type="goal"
          open={isGoalDialogOpen}
          onClose={() => setIsGoalDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.goalAmount}
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

        {/* Alert */}
        <Snackbar 
          open={alert.open} 
          autoHideDuration={4000} 
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
            severity={alert.severity}
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default Savings;