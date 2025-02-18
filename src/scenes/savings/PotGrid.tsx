import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box,
  Paper,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Target, Trash2 } from 'lucide-react';
import { Pot } from '@/types/pots';
import { POT_CATEGORIES } from '@/constants/potCategories';
import GoalCompletionCelebration from '@/components/GoalCompletionCelebration';

const PotCard = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2),
  height: '100%',
  background: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  }
}));

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  potName: string;
  balance: number;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  potName,
  balance
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 3,
        p: 2
      }
    }}
  >
    <DialogTitle sx={{ 
      color: '#EF4444',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      pb: 1
    }}>
      <Trash2 size={20} />
      Delete Savings Pot
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Are you sure you want to delete <strong>{potName}</strong>?
      </Typography>
      {balance > 0 && (
        <Typography variant="body2" sx={{ 
          p: 2,
          bgcolor: '#F1F5F9',
          borderRadius: 2,
          color: 'text.secondary'
        }}>
          The remaining balance of <strong>₹{balance.toLocaleString()}</strong> will be transferred to your wallet.
        </Typography>
      )}
    </DialogContent>
    <DialogActions sx={{ pt: 2 }}>
      <Button 
        onClick={onClose}
        variant="outlined"
        sx={{ 
          color: 'text.secondary',
          borderColor: 'divider'
        }}
      >
        Cancel
      </Button>
      <Button 
        onClick={onConfirm}
        variant="contained"
        sx={{ 
          bgcolor: '#EF4444',
          '&:hover': {
            bgcolor: '#DC2626'
          }
        }}
      >
        Delete Pot
      </Button>
    </DialogActions>
  </Dialog>
);

interface PotGridProps {
  pots: Pot[];
  onDeposit: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
  onSetGoal: (pot: Pot) => void;
  onDelete: (potId: string) => void;
  onCreateNew: () => void;
  getCategoryName: (categoryId: string) => string;
  getCategoryColor: (categoryId: string) => string;
}

const PotGrid: React.FC<PotGridProps> = ({
  pots,
  onDeposit,
  onWithdraw,
  onSetGoal,
  onDelete,
  onCreateNew,
  getCategoryName,
  getCategoryColor
}) => {
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    potId?: string;
    potName?: string;
    balance?: number;
  }>({
    open: false
  });

  const [showCelebration, setShowCelebration] = useState<{
    show: boolean;
    potName: string;
    goalAmount: number;
  }>({
    show: false,
    potName: '',
    goalAmount: 0
  });

  const handleDeleteClick = (pot: Pot) => {
    setDeleteDialog({
      open: true,
      potId: pot._id,
      potName: pot.name,
      balance: pot.balance
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.potId) {
      onDelete(deleteDialog.potId);
    }
    setDeleteDialog({ open: false });
  };

  useEffect(() => {
    // Check if any pot has just reached its goal
    pots.forEach(pot => {
      if (pot.goalAmount > 0 && pot.balance >= pot.goalAmount) {
        // Only show celebration if we haven't shown it before for this pot
        const celebrationShown = localStorage.getItem(`goal-celebration-${pot._id}`);
        if (!celebrationShown) {
          setShowCelebration({
            show: true,
            potName: pot.name,
            goalAmount: pot.goalAmount
          });
          // Mark this celebration as shown
          localStorage.setItem(`goal-celebration-${pot._id}`, 'true');
        }
      }
    });
  }, [pots]);

  if (!pots || pots.length === 0) {
    return (
      <Box sx={{ 
        height: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#F8FAFC',
        borderRadius: 4,
        p: 4
      }}>
        <Typography variant="h4" sx={{ 
          mb: 2, 
          fontWeight: 600,
          background: 'linear-gradient(to right, #10B981, #059669)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Create Your First Savings Pot
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start saving towards your goals with customized savings pots
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onCreateNew}
          sx={{ 
            px: 4, 
            py: 1.5,
            background: 'linear-gradient(to right, #10B981, #059669)',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)',
            '&:hover': {
              background: 'linear-gradient(to right, #059669, #047857)'
            }
          }}
        >
          Create Pot
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {pots.map((pot) => {
          const category = POT_CATEGORIES.find(c => c.id === pot.category);
          const hasGoal = pot.goalAmount > 0;
          const progress = hasGoal ? Math.min((pot.balance / pot.goalAmount) * 100, 100) : 0;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={pot._id}>
              <PotCard>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ 
                      mr: 1.5,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: '#10B98115',
                      fontSize: '1.5rem'
                    }}>{category?.icon}</Typography>
                    <Box>
                      <Typography sx={{ 
                        color: '#10B981',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        mb: 0.5,
                        lineHeight: 1.2
                      }}>
                        {pot.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.8rem'
                        }}
                      >
                        {category?.name}
                      </Typography>
                    </Box>
                  </Box>
                  {hasGoal && (
                    <IconButton 
                      onClick={() => handleDeleteClick(pot)}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: '#EF4444'
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  )}
                </Box>

                <Typography sx={{ 
                  mb: hasGoal ? 2 : 1,
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: '1.4rem'
                }}>
                  ₹{pot.balance.toLocaleString()}
                </Typography>

                {hasGoal ? (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1 
                    }}>
                      <Typography 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        Goal: ₹{pot.goalAmount.toLocaleString()}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: progress >= 100 ? '#059669' : '#10B981',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                      >
                        {progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#10B98115',
                        '& .MuiLinearProgress-bar': {
                          background: progress >= 100 
                            ? 'linear-gradient(to right, #059669, #047857)'
                            : 'linear-gradient(to right, #10B981, #059669)',
                          borderRadius: 3
                        }
                      }}
                    />
                    
                    {progress >= 100 && (
                      <Typography 
                        sx={{ 
                          color: '#059669',
                          fontWeight: 600,
                          mt: 1,
                          textAlign: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        🎉 Goal Achieved!
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography 
                    sx={{ 
                      mb: 2,
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    Set a goal to start tracking progress
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  {hasGoal ? (
                    <>
                      <Button
                        fullWidth
                        onClick={() => onDeposit(pot)}
                        sx={{
                          background: 'linear-gradient(to right, #10B981, #059669)',
                          color: 'white',
                          borderRadius: 2,
                          py: 1,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(to right, #059669, #047857)'
                          }
                        }}
                      >
                        Add Money
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => onWithdraw(pot)}
                        disabled={pot.balance <= 0}
                        sx={{
                          color: '#10B981',
                          borderColor: '#10B981',
                          borderRadius: 2,
                          py: 1,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#059669',
                            bgcolor: '#10B98115'
                          }
                        }}
                        variant="outlined"
                      >
                        Withdraw
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        onClick={() => onSetGoal(pot)}
                        startIcon={<Target size={20} />}
                        sx={{
                          background: 'linear-gradient(to right, #10B981, #059669)', // Consistent emerald gradient
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(to right, #059669, #047857)'
                          }
                        }}
                      >
                        Set Goal
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => handleDeleteClick(pot)}
                        startIcon={<Trash2 size={20} />}
                        sx={{
                          color: '#EF4444',
                          borderColor: '#EF4444',
                          '&:hover': {
                            bgcolor: '#FEE2E2',
                            borderColor: '#EF4444'
                          }
                        }}
                        variant="outlined"
                      >
                        Delete Pot
                      </Button>
                    </>
                  )}
                </Box>

                {hasGoal && (
                  <Button
                    fullWidth
                    onClick={() => onSetGoal(pot)}
                    sx={{ 
                      mt: 1,
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#10B981' // Consistent emerald color
                      }
                    }}
                  >
                    Update Goal
                  </Button>
                )}
              </PotCard>
            </Grid>
          );
        })}
      </Grid>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDeleteConfirm}
        potName={deleteDialog.potName || ''}
        balance={deleteDialog.balance || 0}
      />

      {showCelebration.show && (
        <GoalCompletionCelebration
          potName={showCelebration.potName}
          goalAmount={showCelebration.goalAmount}
          onComplete={() => setShowCelebration(prev => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
};

export default PotGrid;
