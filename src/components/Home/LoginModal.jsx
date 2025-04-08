import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, X, CheckCircle } from 'lucide-react';

const LoginModal = ({ open, onClose, onRegister }) => {
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoginSuccess(true);
        
        // Delay navigation to show success animation
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      if (!loginSuccess) {
        setIsLoading(false);
      }
    }
  };

  const SuccessAnimation = () => (
    <motion.div 
      className="absolute inset-0 bg-emerald-500/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
      >
        <CheckCircle className="w-20 h-20 text-white" strokeWidth={1.5} />
      </motion.div>
      <motion.h3 
        className="text-white text-xl font-medium mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Login Successful!
      </motion.h3>
      <motion.p 
        className="text-white/80 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Redirecting to dashboard...
      </motion.p>
    </motion.div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-10 rounded-3xl border border-emerald-500/20 w-full max-w-md relative z-10 shadow-xl shadow-emerald-900/20"
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </motion.button>

          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-600/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-white text-3xl font-bold">₹</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Welcome Back</h2>
            <p className="text-gray-400">Login to access your secure banking dashboard</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="Enter PAN Number"
                  className="w-full bg-white/5 border border-white/10 text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-500 group-hover:border-emerald-500/30"
                  maxLength={10}
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-xs text-gray-500">
                  {pan.length}/10
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-white/5 border border-white/10 text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-500 group-hover:border-emerald-500/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-400" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all"
              disabled={isLoading || loginSuccess}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : loginSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Logged In</span>
                </div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <motion.button 
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                whileHover={{ scale: 1.05 }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline-offset-2 hover:underline"
              >
                Sign up
              </motion.button>
            </p>
          </div>

          {/* Success Animation Overlay */}
          <AnimatePresence>
            {loginSuccess && <SuccessAnimation />}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginModal;
