import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CreditCard, Phone, Lock, Building, ArrowRight } from 'lucide-react';

const RegisterModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle click outside
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleNext = async () => {
    setError('');

    // Basic validation
    if (!pan || pan.length !== 10) {
      setError('Please enter a valid PAN number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/user/getLinkedAccounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pan }),
      });

      const data = await response.json();

      if (data.success) {
        setLinkedAccounts(data.accounts);
        if (data.accounts.length === 0) {
          setError('No bank accounts found for this PAN');
          return;
        }
        setStep(2);
      } else {
        setError(data.message || 'Failed to fetch linked accounts');
      }
    } catch (err) {
      console.error('Error fetching linked accounts:', err);
      setError('Network error while fetching bank accounts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:9000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          pan, 
          phone 
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white text-2xl font-bold">₹</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Register to start managing your finances</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step === 1 ? (
              <form className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium
                    focus:bg-white/20 hover:bg-white/15"
                    required
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    Full Name
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium
                    focus:bg-white/20 hover:bg-white/15"
                    required
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    Email Address
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium tracking-wider
                    focus:bg-white/20 hover:bg-white/15"
                    required
                    maxLength={10}
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    PAN Number
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="1234567890"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium tracking-wider
                    focus:bg-white/20 hover:bg-white/15"
                    required
                    maxLength={10}
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    Phone Number
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium tracking-wider
                    focus:bg-white/20 hover:bg-white/15"
                    required
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    Password
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 text-white px-12 py-4 rounded-xl 
                    focus:outline-none focus:border-emerald-400 transition-all
                    placeholder:text-gray-300/50 text-lg font-medium tracking-wider
                    focus:bg-white/20 hover:bg-white/15"
                    required
                  />
                  <div className="absolute text-[10px] text-emerald-400/80 left-12 -top-2 bg-slate-800/40 px-2">
                    Confirm Password
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
                  type="button"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Linked Bank Accounts</h3>
                <div className="space-y-3 mb-6">
                  {linkedAccounts.map((account, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">{account.bankName}</p>
                          <p className="text-gray-400 text-sm">
                            Account: {account.accountNumber} • IFSC: {account.ifscCode}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
                >
                  Complete Registration <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body
  );
};

export default RegisterModal;
