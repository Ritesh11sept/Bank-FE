import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';

const PasswordSetup = ({ onSubmit }) => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Too Weak',
    color: 'bg-red-500'
  });
  
  const strengthLabels = [
    { score: 0, label: 'Too Weak', color: 'bg-red-500' },
    { score: 1, label: 'Weak', color: 'bg-orange-500' },
    { score: 2, label: 'Medium', color: 'bg-yellow-500' },
    { score: 3, label: 'Strong', color: 'bg-emerald-500' },
    { score: 4, label: 'Very Strong', color: 'bg-emerald-400' }
  ];
  
  // Password validation criteria
  const criteria = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'lowercase', label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { id: 'uppercase', label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'number', label: 'Contains number', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'Contains special character', test: (p) => /[^A-Za-z0-9]/.test(p) }
  ];
  
  const [passedCriteria, setPassedCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });
  
  useEffect(() => {
    const password = passwords.password;
    const newPassedCriteria = {};
    
    // Check which criteria are met
    criteria.forEach(criterion => {
      newPassedCriteria[criterion.id] = criterion.test(password);
    });
    
    setPassedCriteria(newPassedCriteria);
    
    // Calculate password strength score (0-4)
    const passedCount = Object.values(newPassedCriteria).filter(Boolean).length;
    const score = Math.min(Math.floor(passedCount * 0.8), 4);
    
    setStrength(strengthLabels[score]);
  }, [passwords.password]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const isPasswordStrong = () => {
    // Password must satisfy at least 3 criteria to be considered strong
    const passedCount = Object.values(passedCriteria).filter(Boolean).length;
    return passedCount >= 3;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    const newErrors = {};
    
    if (!passwords.password) {
      newErrors.password = 'Password is required';
    } else if (passwords.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!isPasswordStrong()) {
      newErrors.password = 'Please choose a stronger password';
    }
    
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(passwords.password, isPasswordStrong());
  };
  
  return (
    <motion.div 
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-2xl font-bold text-white mb-2">Create Password</h3>
      <p className="text-gray-400 mb-6">Choose a strong password for your account</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center text-white mb-1.5 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={passwords.password}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400 pr-10`}
              placeholder="Enter your password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          
          {/* Password strength indicator */}
          {passwords.password && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-white/60">Password Strength:</span>
                <span className={`text-xs font-medium 
                  ${strength.color === 'bg-red-500' ? 'text-red-400' : 
                    strength.color === 'bg-orange-500' ? 'text-orange-400' : 
                    strength.color === 'bg-yellow-500' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strength.score + 1) * 20}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center text-white mb-1.5 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400 pr-10`}
              placeholder="Confirm your password"
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        
        {/* Password criteria list */}
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          <h4 className="text-white text-sm font-medium mb-2">Password requirements:</h4>
          {criteria.map((criterion) => (
            <div key={criterion.id} className="flex items-center gap-2">
              {passedCriteria[criterion.id] ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <X className="w-4 h-4 text-white/40" />
              )}
              <span className={`text-xs ${passedCriteria[criterion.id] ? 'text-white' : 'text-white/60'}`}>
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 mt-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          Continue to Verification
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PasswordSetup;
