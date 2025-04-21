import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const PasswordSetup = ({ onSubmit }) => {
  const { translations } = useTranslation();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: translations.passwordSetup.strengthLabels.tooWeak,
    color: 'bg-red-500'
  });
  
  const strengthLabels = [
    { score: 0, label: translations.passwordSetup.strengthLabels.tooWeak, color: 'bg-red-500' },
    { score: 1, label: translations.passwordSetup.strengthLabels.weak, color: 'bg-orange-500' },
    { score: 2, label: translations.passwordSetup.strengthLabels.medium, color: 'bg-yellow-500' },
    { score: 3, label: translations.passwordSetup.strengthLabels.strong, color: 'bg-emerald-500' },
    { score: 4, label: translations.passwordSetup.strengthLabels.veryStrong, color: 'bg-emerald-400' }
  ];
  
  // Password validation criteria
  const criteria = [
    { id: 'length', label: translations.passwordSetup.criteria.length, test: (p) => p.length >= 8 },
    { id: 'lowercase', label: translations.passwordSetup.criteria.lowercase, test: (p) => /[a-z]/.test(p) },
    { id: 'uppercase', label: translations.passwordSetup.criteria.uppercase, test: (p) => /[A-Z]/.test(p) },
    { id: 'number', label: translations.passwordSetup.criteria.number, test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: translations.passwordSetup.criteria.special, test: (p) => /[^A-Za-z0-9]/.test(p) }
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
  }, [passwords.password, criteria, strengthLabels]);
  
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
      newErrors.password = translations.passwordSetup.passwordRequired;
    } else if (passwords.password.length < 6) {
      newErrors.password = translations.passwordSetup.passwordLength;
    } else if (!isPasswordStrong()) {
      newErrors.password = translations.passwordSetup.weakPassword;
    }
    
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = translations.passwordSetup.confirmRequired;
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = translations.passwordSetup.passwordsNoMatch;
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
      <h3 className="text-2xl font-bold text-white mb-2">{translations.passwordSetup.title}</h3>
      <p className="text-gray-400 mb-6">{translations.passwordSetup.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center text-white mb-1.5 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            {translations.passwordSetup.password}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={passwords.password}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400 pr-10`}
              placeholder={translations.passwordSetup.enterPassword}
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
                <span className="text-xs text-white/60">{translations.passwordSetup.passwordStrength}</span>
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
            {translations.passwordSetup.confirmPassword}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400 pr-10`}
              placeholder={translations.passwordSetup.confirmYourPassword}
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
          <h4 className="text-white text-sm font-medium mb-2">{translations.passwordSetup.requirements}</h4>
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
          {translations.passwordSetup.continueButton}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PasswordSetup;
