import React, { useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import Lottie from 'react-lottie';
import successAnimation from '@/assets/success-animation.json';

interface SuccessAnimationProps {
  title: string;
  subtitle?: string;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  title, 
  subtitle,
  onComplete 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000); // Increased from 2500 to 3000ms

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            animation: 'scaleIn 0.8s ease-out',
            transform: 'scale(1.5)', // Make the animation larger
            mb: 4, // Add more space between animation and text
            '@keyframes scaleIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.5)',
              },
              '70%': {
                transform: 'scale(1.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1.5)',
              },
            },
          }}
        >
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: successAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            height={300} // Increased from 200
            width={300}  // Increased from 200
          />
        </Box>
        
        <Box
          sx={{
            textAlign: 'center',
            animation: 'slideUp 0.8s ease-out 0.3s both',
            maxWidth: '600px',
            width: '100%',
            '@keyframes slideUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h3"
            sx={{ 
              color: 'white',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              mb: 2,
              fontSize: { 
                xs: '1.75rem',
                sm: '2rem',
                md: '2.25rem'
              },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="h6"
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                margin: '0 auto',
                fontWeight: 500,
                fontSize: { 
                  xs: '1rem',
                  sm: '1.1rem',
                  md: '1.25rem'
                },
                lineHeight: 1.4
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150%', // Increased from 100%
            height: '150%', // Increased from 100%
            background: 'radial-gradient(circle at center, transparent 0%, rgba(16,185,129,0.3) 100%)',
            opacity: 0.8, // Increased from 0.6
            animation: 'pulse 2.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'translate(-50%, -50%) scale(1)' },
              '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
              '100%': { transform: 'translate(-50%, -50%) scale(1)' },
            },
          }}
        />
      </Box>
    </Fade>
  );
};

export default SuccessAnimation;
