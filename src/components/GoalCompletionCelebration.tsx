import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Paper } from '@mui/material';
import ReactConfetti from 'react-confetti';
import Lottie from 'react-lottie';
import successAnimation from '@/assets/success-animation.json';

interface GoalCompletionCelebrationProps {
  potName: string;
  goalAmount: number;
  onComplete?: () => void;
}

const GoalCompletionCelebration: React.FC<GoalCompletionCelebrationProps> = ({
  potName,
  goalAmount,
  onComplete
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.2}
      />
      
      <Fade in timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            maxWidth: 500,
            mx: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              mb: 3,
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
            }}
          >
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: successAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice'
                }
              }}
              height={150}
              width={150}
            />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(to right, #10B981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🎉 Congratulations! 🎉
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: '#0F172A',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            You've reached your goal of ₹{goalAmount.toLocaleString()} for {potName}!
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#64748B',
              lineHeight: 1.6,
            }}
          >
            Keep up the great work! Why not set a new goal to continue your savings journey?
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default GoalCompletionCelebration;
