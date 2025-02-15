import React from 'react';
import { Grid, Typography, Button, LinearProgress } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { Box } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import { Pot } from '@/types/pots';

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
  if (!pots || pots.length === 0) {
    return (
      <DashboardBox sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          You haven't created any pots yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first pot to start saving for your goals
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          Create Your First Pot
        </Button>
      </DashboardBox>
    );
  }

  return (
    <Grid container spacing={3}>
      {pots.map((pot) => (
        <Grid item xs={12} md={6} lg={4} key={pot._id}>
          <DashboardBox>
            <Box sx={{ p: 2 }}>
              <FlexBetween>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: getCategoryColor(pot.category),
                    fontWeight: 600
                  }}
                >
                  {pot.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: `${getCategoryColor(pot.category)}15`,
                    color: getCategoryColor(pot.category),
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    fontWeight: 500
                  }}
                >
                  {getCategoryName(pot.category)}
                </Typography>
              </FlexBetween>
              
              <Typography variant="h5" sx={{ my: 2, fontWeight: 700 }}>
                ₹{pot.balance.toLocaleString()}
              </Typography>
              
              {pot.goalAmount > 0 && (
                <>
                  <FlexBetween sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Goal: ₹{pot.goalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {((pot.balance / pot.goalAmount) * 100).toFixed(0)}%
                    </Typography>
                  </FlexBetween>
                  
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((pot.balance / pot.goalAmount) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: `${getCategoryColor(pot.category)}15`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getCategoryColor(pot.category),
                      },
                      mb: 2
                    }}
                  />
                </>
              )}
              
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => onDeposit(pot)}
                  >
                    Deposit
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => onWithdraw(pot)}
                    disabled={pot.balance <= 0}
                  >
                    Withdraw
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    onClick={() => onSetGoal(pot)}
                  >
                    {pot.goalAmount > 0 ? 'Update Goal' : 'Set Goal'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => onDelete(pot._id)}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DashboardBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default PotGrid;
