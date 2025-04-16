import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit,
  Trash2,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const BudgetCategoryMonitoring = ({ data }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample data if none provided
  const categoryData = [
    { name: 'Housing', value: 35, transactions: 120, anomalies: 2 },
    { name: 'Food', value: 25, transactions: 250, anomalies: 0 },
    { name: 'Transportation', value: 12, transactions: 85, anomalies: 1 },
    { name: 'Entertainment', value: 8, transactions: 62, anomalies: 0 },
    { name: 'Shopping', value: 15, transactions: 110, anomalies: 3 },
    { name: 'Healthcare', value: 5, transactions: 40, anomalies: 0 },
  ];

  const anomalyData = [
    { category: 'Housing', date: '2023-06-10', amount: 1250, expected: 900, diff: 38.9 },
    { category: 'Transportation', date: '2023-06-07', amount: 120, expected: 60, diff: 100 },
    { category: 'Shopping', date: '2023-06-12', amount: 430, expected: 200, diff: 115 },
    { category: 'Shopping', date: '2023-06-05', amount: 350, expected: 200, diff: 75 },
    { category: 'Shopping', date: '2023-05-28', amount: 380, expected: 200, diff: 90 },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  // Custom emerald color palette
  const COLORS = [
    '#10B981', // primary emerald
    '#059669', // darker emerald
    '#34D399', // lighter emerald
    '#A7F3D0', // very light emerald
    '#064E3B', // very dark emerald
    '#6EE7B7', // mint emerald
  ];

  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '12px',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fdfb 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#064E3B',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40px',
                height: '3px',
                backgroundColor: '#10B981',
                borderRadius: '2px'
              }
            }}
          >
            Budget Categories
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PlusCircle size={18} />}
            sx={{ 
              bgcolor: '#10B981',
              '&:hover': {
                bgcolor: '#059669',
              },
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              py: 1,
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            Add Category
          </Button>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)} 
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#10B981',
              height: 3,
              borderRadius: '3px'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                color: '#064E3B',
                fontWeight: 600
              }
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Usage Stats" />
          <Tab label="Anomalies" />
          <Tab label="Templates" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600, 
                    color: '#064E3B' 
                  }}
                >
                  Category Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1000}
                      animationBegin={0}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600, 
                    color: '#064E3B' 
                  }}
                >
                  Anomaly Detection
                </Typography>
                <List>
                  {anomalyData.slice(0, 4).map((anomaly, index) => (
                    <ListItem 
                      key={index} 
                      divider={index < anomalyData.length - 1}
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha('#10B981', 0.04)
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={500} color="#064E3B">
                            {anomaly.category}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            ${anomaly.amount} ({anomaly.diff}% over expected)
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          sx={{ 
                            color: '#F59E0B',
                            '&:hover': {
                              backgroundColor: alpha('#F59E0B', 0.1)
                            }
                          }}
                        >
                          <AlertTriangle size={18} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    size="small" 
                    variant="text"
                    sx={{
                      color: '#10B981',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: alpha('#10B981', 0.08)
                      }
                    }}
                  >
                    View All Anomalies
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
              <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
              <YAxis yAxisId="right" orientation="right" stroke="#059669" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="value" 
                name="Usage %" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                yAxisId="right" 
                dataKey="transactions" 
                name="Transactions" 
                fill="#059669" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ fontWeight: 600, color: '#064E3B' }}
            >
              Spending Anomalies Detected
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The following transactions have been flagged as potential anomalies based on historical spending patterns.
            </Typography>
            
            <List sx={{ 
              backgroundColor: alpha('#F3F4F6', 0.5),
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {anomalyData.map((anomaly, index) => (
                <ListItem 
                  key={index} 
                  divider={index < anomalyData.length - 1}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AlertTriangle 
                          size={18} 
                          color="#F59E0B" 
                          style={{ marginRight: '8px' }} 
                        />
                        <Typography variant="subtitle2" color="#064E3B" fontWeight={600}>
                          {anomaly.category}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Transaction of ${anomaly.amount} on {anomaly.date}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          component="div" 
                          color="#EF4444"
                          sx={{ fontWeight: 500, mt: 0.5 }}
                        >
                          {anomaly.diff}% higher than usual spending
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{
                        borderColor: '#10B981',
                        color: '#10B981',
                        textTransform: 'none',
                        borderRadius: '6px',
                        '&:hover': {
                          borderColor: '#059669',
                          backgroundColor: alpha('#10B981', 0.04)
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      Review
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {tabValue === 3 && (
          <Grid container spacing={2}>
            {categoryData.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
                    },
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      backgroundColor: COLORS[index % COLORS.length]
                    }
                  }}
                >
                  <CardHeader
                    title={
                      <Typography variant="h6" color="#064E3B" fontWeight={600} fontSize="1rem">
                        {category.name}
                      </Typography>
                    }
                    action={
                      <IconButton 
                        aria-label="edit" 
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        sx={{
                          color: '#10B981',
                          '&:hover': {
                            backgroundColor: alpha('#10B981', 0.1)
                          }
                        }}
                      >
                        <Edit size={18} />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Default Allocation: <Typography component="span" fontWeight={600} color="#064E3B">{category.value}%</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transactions: <Typography component="span" fontWeight={600} color="#064E3B">{category.transactions}</Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Edit Category Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#064E3B', fontWeight: 600 }}>
          Edit Category
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            defaultValue={selectedCategory?.name || ''}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#10B981'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#10B981'
              }
            }}
          />
          <TextField
            margin="dense"
            label="Default Allocation (%)"
            fullWidth
            variant="outlined"
            type="number"
            defaultValue={selectedCategory?.value || ''}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#10B981'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#10B981'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              color: '#6B7280',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              bgcolor: '#10B981',
              '&:hover': {
                bgcolor: '#059669',
              },
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetCategoryMonitoring;
