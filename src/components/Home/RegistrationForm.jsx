import React, { useState, useEffect } from 'react';
import { Calendar, Mail, User, Phone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';

const RegistrationForm = ({ initialData, onSubmit }) => {
  const { translations } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    pan: initialData.pan || '',
    dateOfBirth: initialData.dateOfBirth || '',
    age: initialData.age || '',
  });
  const [errors, setErrors] = useState({});

  // Calculate age whenever date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      if (today.getMonth() < dob.getMonth() || 
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dateOfBirth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name) newErrors.name = translations.registrationForm.nameRequired;
    if (!formData.email) newErrors.email = translations.registrationForm.emailRequired;
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = translations.registrationForm.emailInvalid;
    if (!formData.phone) newErrors.phone = translations.registrationForm.phoneRequired;
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = translations.registrationForm.phoneInvalid;
    if (!formData.pan) newErrors.pan = translations.registrationForm.panRequired;
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = translations.registrationForm.panInvalid;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = translations.registrationForm.dobRequired;
    if (!formData.age) newErrors.age = translations.registrationForm.ageRequired;
    else if (parseInt(formData.age, 10) < 18) newErrors.age = translations.registrationForm.ageMinimum;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <motion.div 
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-2xl font-bold text-white mb-2">{translations.registrationForm.title}</h3>
      <p className="text-gray-400 mb-6">{translations.registrationForm.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <User className="w-4 h-4 mr-2" />
              {translations.registrationForm.fullName}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.namePlaceholder}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              {translations.registrationForm.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.emailPlaceholder}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              {translations.registrationForm.phone}
            </label>
            <div className="flex">
              <span className="bg-white/10 border border-white/20 border-r-0 rounded-l-lg p-3 text-white/60">+91</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-r-lg text-white focus:outline-none focus:border-emerald-400`}
                placeholder={translations.registrationForm.phonePlaceholder}
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <CreditCard className="w-4 h-4 mr-2" />
              {translations.registrationForm.pan}
            </label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.pan ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.panPlaceholder}
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {translations.registrationForm.dob}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // Set max date to 18 years ago
              className={`w-full p-3 bg-white/10 border ${errors.dateOfBirth ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <User className="w-4 h-4 mr-2" />
              {translations.registrationForm.age}
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${errors.age ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.agePlaceholder}
              min="18"
              max="120"
              readOnly // Make this readonly since it's calculated from DOB
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 mt-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {translations.registrationForm.continueButton}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
