import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Lottie from 'react-lottie';
import successAnimation from '../../../assets/success-animation.json';

const GoalCompletionCelebration = ({
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
    <div
      className="fixed inset-0 bg-black bg-opacity-85 z-[9999] flex items-center justify-center"
    >
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.2}
      />
      
      <div className="animate-fade-in" style={{animationDuration: '1000ms'}}>
        <div
          className="p-8 rounded-2xl text-center max-w-lg mx-2 bg-gradient-to-br from-white to-[#f8fafc] shadow-2xl relative overflow-hidden"
        >
          <div
            className="mb-6 animate-bounce"
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
          </div>
          
          <h1
            className="mb-4 font-bold text-3xl bg-gradient-to-r from-[#10B981] to-[#059669] text-transparent bg-clip-text"
          >
            🎉 Congratulations! 🎉
          </h1>
          
          <h2
            className="mb-6 text-[#0F172A] font-semibold text-xl leading-relaxed"
          >
            You've reached your goal of ₹{goalAmount.toLocaleString()} for {potName}!
          </h2>
          
          <p
            className="text-[#64748B] leading-relaxed"
          >
            Keep up the great work! Why not set a new goal to continue your savings journey?
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalCompletionCelebration;