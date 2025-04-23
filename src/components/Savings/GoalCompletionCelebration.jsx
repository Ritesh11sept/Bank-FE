import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

const GoalCompletionCelebration = ({ isVisible, onClose, goalName }) => {
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
    
    // Automatically close the celebration after 5 seconds
    const timer = setTimeout(() => {
      if (isVisible) {
        onClose();
      }
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
      />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-lg p-6 shadow-2xl relative z-10 max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="text-center">
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 1.5 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h2>
          <p className="text-lg mb-4">
            {goalName ? `You've reached your goal for "${goalName}"!` : "You've reached your savings goal!"}
          </p>
          <p className="text-sm text-gray-600">
            Keep up the great work with your financial journey!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-medium"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalCompletionCelebration;