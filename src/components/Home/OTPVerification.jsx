import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const OTPVerification = ({ phone, onVerify, loading }) => {
  const { translations } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  
  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    
    // Clear error on input
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(translations.otp.completeOtpError);
      return;
    }
    onVerify();
  };

  const handleResend = () => {
    // In a real app, call the API to resend OTP
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    // Show success message
    alert(translations.otp.resendSuccess);
  };

  return (
    <motion.div 
      className="p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-2xl font-bold text-white mb-4">{translations.otp.title}</h3>
      <p className="text-gray-400 mb-6">
        {translations.otp.sentMessage}<br />
        <span className="text-emerald-400">+91 {phone}</span>
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-white bg-white/10 border border-white/20 rounded-lg
              focus:outline-none focus:border-emerald-400 text-xl font-bold"
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl flex items-center justify-center"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin mr-2" />
        ) : null}
        {loading ? translations.otp.verifying : translations.otp.verifyButton}
      </motion.button>

      <p className="mt-6 text-gray-400 text-sm">
        {translations.otp.didntReceive}{' '}
        {resendTimer > 0 ? (
          <span>{translations.otp.resendIn} {resendTimer}{translations.otp.seconds}</span>
        ) : (
          <button
            onClick={handleResend}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {translations.otp.resendOtp}
          </button>
        )}
      </p>
      
      <p className="mt-4 text-gray-500 text-xs">
        {translations.otp.demoMessage}{' '}
        <span className="text-white font-medium">{translations.otp.demoCode}</span>{' '}
        {translations.otp.forDemo}
      </p>
    </motion.div>
  );
};

export default OTPVerification;
