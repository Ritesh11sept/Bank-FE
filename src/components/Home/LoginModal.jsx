import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, X, CheckCircle, Shield } from 'lucide-react';
import { useLoginUserMutation } from '../../state/api';
import { useAdminLoginMutation } from '../../state/adminApi';

const LoginModal = ({ open, onClose, onRegister }) => {
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminMode) {
      setPan('admin');
      setPassword('admin123');
    } else {
      setPan('');
      setPassword('');
    }
  }, [isAdminMode]);

  const [loginUser, { isLoading: userLoading }] = useLoginUserMutation();
  const [adminLogin, { isLoading: adminLoading }] = useAdminLoginMutation();
  const isLoading = userLoading || adminLoading;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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

    try {
      if (isAdminMode) {
        console.log('Attempting admin login with:', { username: pan, password });

        const result = await adminLogin({
          username: pan,
          password,
        }).unwrap();

        console.log('Admin login response:', result);

        // Check if we have a valid response
        if (result && (result.token || (result.data && result.data.token))) {
          const token = result.token || result.data.token;
          const user = result.user || result.data.user;

          // Store admin data
          localStorage.setItem('adminToken', token);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminUser', JSON.stringify(user));

          setLoginSuccess(true);

          // Use a slightly longer delay to ensure storage is complete
          setTimeout(() => {
            onClose();
            navigate('/admin/dashboard', { replace: true });
          }, 1500);
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        console.log('Attempting user login with PAN:', pan);
        const response = await loginUser({
          pan,
          password,
        }).unwrap();

        console.log('User login successful');

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setLoginSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/landing');
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const SuccessAnimation = ({ isAdmin = false }) => (
    <motion.div
      className={`absolute inset-0 ${isAdmin ? 'bg-blue-500/95' : 'bg-emerald-500/95'} backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-3xl`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
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
        Redirecting to {isAdmin ? 'admin' : 'dashboard'}...
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
          transition={{ type: 'spring', duration: 0.5 }}
          className={`${isAdminMode ? 'bg-gradient-to-br from-sky-50/90 to-blue-100/90' : 'bg-gradient-to-br from-gray-50/90 to-emerald-50/90'} backdrop-blur-md p-8 md:p-10 rounded-3xl border ${isAdminMode ? 'border-blue-200/70' : 'border-emerald-200/70'} w-full max-w-md relative z-10 shadow-xl ${isAdminMode ? 'shadow-blue-500/20' : 'shadow-emerald-500/20'}`}
          layout
        >
          {/* Mode transition background effect */}
          <motion.div 
            className={`absolute inset-0 rounded-3xl -z-10 opacity-70 backdrop-blur-md`}
            animate={{ 
              background: isAdminMode 
                ? 'linear-gradient(135deg, rgba(186, 230, 253, 0.7), rgba(191, 219, 254, 0.7))' 
                : 'linear-gradient(135deg, rgba(236, 253, 245, 0.7), rgba(209, 250, 229, 0.7))' 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`absolute right-4 top-4 ${isAdminMode ? 'text-blue-500' : 'text-emerald-500'} p-2 rounded-full bg-white/80 hover:bg-white transition-colors`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </motion.button>

          <div className="text-center mb-8">
            <motion.div 
              className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg`}
              animate={{ 
                background: isAdminMode 
                  ? 'linear-gradient(to bottom right, #60a5fa, #2563eb)' 
                  : 'linear-gradient(to bottom right, #34d399, #059669)'
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <motion.span 
                className="text-white text-3xl font-bold"
                key={isAdminMode ? 'admin' : 'user'}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                {isAdminMode ? <Shield className="h-10 w-10" /> : "₹"}
              </motion.span>
            </motion.div>
            <motion.h2 
              className={`text-3xl font-bold mb-3`}
              animate={{ 
                color: isAdminMode ? 'rgb(29, 78, 216)' : 'rgb(4, 120, 87)' 
              }}
              transition={{ duration: 0.5 }}
            >
              {isAdminMode ? 'Admin Access' : 'Welcome Back'}
            </motion.h2>
            <motion.p 
              animate={{ 
                color: isAdminMode ? 'rgba(37, 99, 235, 0.8)' : 'rgba(5, 150, 105, 0.8)' 
              }}
              transition={{ duration: 0.5 }}
            >
              {isAdminMode 
                ? 'Login to access administrative controls' 
                : 'Login to access your secure banking dashboard'}
            </motion.p>
          </div>

          {/* Login type toggle */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className={`p-1 rounded-xl`}
              animate={{ 
                backgroundColor: isAdminMode ? 'rgba(219, 234, 254, 0.7)' : 'rgba(209, 250, 229, 0.7)' 
              }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setIsAdminMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${
                  !isAdminMode 
                    ? 'text-white z-10' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {!isAdminMode && (
                  <motion.div 
                    className="absolute inset-0 bg-emerald-500"
                    layoutId="tabBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Customer</span>
              </button>
              <button
                onClick={() => setIsAdminMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${
                  isAdminMode 
                    ? 'text-white z-10' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {isAdminMode && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-500"
                    layoutId="tabBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Admin</span>
              </button>
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <motion.div 
                className="relative group"
                animate={{ 
                  y: 0,
                  opacity: 1
                }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5`} style={{ 
                    color: isAdminMode ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
                    transition: 'color 0.5s ease' 
                  }}/>
                </div>
                <motion.input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(isAdminMode ? e.target.value : e.target.value.toUpperCase())}
                  placeholder={isAdminMode ? 'Enter Employee ID' : 'Enter PAN Number'}
                  animate={{ 
                    borderColor: isAdminMode ? 'rgba(147, 197, 253, 0.8)' : 'rgba(110, 231, 183, 0.8)' 
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-full bg-white/70 backdrop-blur-sm border text-gray-800 px-12 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400`}
                  style={{ 
                    boxShadow: `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0)' : 'rgba(16, 185, 129, 0)'}`,
                    transition: 'box-shadow 0.3s ease, border-color 0.5s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0)' : 'rgba(16, 185, 129, 0)'}`
                  }}
                  maxLength={isAdminMode ? 8 : 10}
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-xs text-gray-500">
                  {pan.length}/{isAdminMode ? 8 : 10}
                </div>
              </motion.div>

              <motion.div 
                className="relative group"
                animate={{ 
                  y: 0,
                  opacity: 1
                }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5`} style={{ 
                    color: isAdminMode ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
                    transition: 'color 0.5s ease' 
                  }} />
                </div>
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  animate={{ 
                    borderColor: isAdminMode ? 'rgba(147, 197, 253, 0.8)' : 'rgba(110, 231, 183, 0.8)' 
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-full bg-white/70 backdrop-blur-sm border text-gray-800 px-12 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400`}
                  style={{ 
                    boxShadow: `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0)' : 'rgba(16, 185, 129, 0)'}`,
                    transition: 'box-shadow 0.3s ease, border-color 0.5s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${isAdminMode ? 'rgba(59, 130, 246, 0)' : 'rgba(16, 185, 129, 0)'}`
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" style={{ 
                      color: isAdminMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(16, 185, 129, 0.7)',
                      transition: 'color 0.3s ease' 
                    }} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" style={{ 
                      color: isAdminMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(16, 185, 129, 0.7)',
                      transition: 'color 0.3s ease' 
                    }} />
                  )}
                </button>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ 
                background: isAdminMode 
                  ? 'linear-gradient(to right, #3b82f6, #2563eb)' 
                  : 'linear-gradient(to right, #10b981, #059669)',
                boxShadow: isAdminMode
                  ? '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -4px rgba(59, 130, 246, 0.3)'
                  : '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -4px rgba(16, 185, 129, 0.3)'
              }}
              transition={{ duration: 0.5 }}
              className="w-full py-4 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
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
                  {isAdminMode ? 'Admin Access' : 'Sign In'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {!isAdminMode && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600">
                Don't have an account?{' '}
                <motion.button 
                  onClick={() => {
                    onClose();
                    onRegister();
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline-offset-2 hover:underline"
                >
                  Sign up
                </motion.button>
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {loginSuccess && <SuccessAnimation isAdmin={isAdminMode} />}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginModal;
