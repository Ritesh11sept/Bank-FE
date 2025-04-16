import React, { useEffect } from 'react';
import Lottie from 'react-lottie';
import successAnimation from '../../assets/success-animation.json';

const SuccessAnimation = ({ title, subtitle, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="animate-fade-in">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 z-[9999] flex flex-col items-center justify-center p-3 overflow-hidden">
        <div className="animate-scale-in mb-4 scale-150">
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: successAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            height={300}
            width={300}
          />
        </div>
        
        <div className="animate-slide-up text-center max-w-[600px] w-full">
          <h1 className="text-white font-semibold drop-shadow-md mb-2 text-[1.75rem] sm:text-[2rem] md:text-[2.25rem]">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-white/90 mx-auto font-medium text-base sm:text-lg md:text-xl leading-relaxed">
              {subtitle}
            </h2>
          )}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient opacity-80 animate-pulse-slow" />
      </div>
    </div>
  );
};

export default SuccessAnimation;
