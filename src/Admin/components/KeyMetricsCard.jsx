import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';
import { 
  Users, 
  User,
  Star,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const KeyMetricsCard = ({ title, value, icon, color = '#10B981', trend }) => {
  const theme = useTheme();
  
  const getIcon = () => {
    switch (icon) {
      case 'people':
        return <Users size={38} color={color} />;
      case 'person':
        return <User size={38} color={color} />;
      case 'star':
        return <Star size={38} color={color} />;
      case 'receipt':
        return <Receipt size={38} color={color} />;
      default:
        return <TrendingUp size={38} color={color} />;
    }
  };

  return (
    <MotionPaper
      elevation={0}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha('#10B981', 0.2),
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fdfb 100%)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: color,
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="h6" 
          color="#064E3B"
          sx={{ 
            fontWeight: 500,
            fontSize: '0.95rem'
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: alpha(color, 0.1),
          width: 48,
          height: 48
        }}>
          {getIcon()}
        </Box>
      </Box>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1, 
            color: '#064E3B',
            fontSize: '2.2rem' 
          }}
        >
          {typeof value === 'number' 
            ? new Intl.NumberFormat().format(value) 
            : value}
        </Typography>
      </motion.div>
      
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '4px',
            bgcolor: alpha(trend > 0 ? '#10B981' : '#EF4444', 0.1),
            px: 1,
            py: 0.5
          }}>
            <TrendingUp 
              size={16}
              color={trend > 0 ? '#10B981' : '#EF4444'}
              style={{ 
                transform: trend < 0 ? 'rotate(180deg)' : 'none',
                marginRight: '6px'
              }} 
            />
            <Typography 
              variant="body2"
              sx={{
                color: trend > 0 ? '#10B981' : '#EF4444',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
            </Typography>
          </Box>
        </Box>
      )}
    </MotionPaper>
  );
};

export default KeyMetricsCard;
