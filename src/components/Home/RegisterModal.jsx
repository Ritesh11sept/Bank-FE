import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader, ArrowLeft, AlertCircle } from 'lucide-react';
import PANVerification from './PANVerification';
import RegistrationForm from './RegistrationForm';
import PasswordSetup from './PasswordSetup';
import OTPVerification from './OTPVerification';
import Toast from './Toast';
import { useRegisterUserMutation, useExtractPANDetailsMutation } from '../state/api';

const RegisterModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    dateOfBirth: '',
    age: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const [extractPANDetails] = useExtractPANDetailsMutation();
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUserData({
        name: '',
        email: '',
        phone: '',
        pan: '',
        dateOfBirth: '',
        age: '',
        password: '',
      });
      setSuccess(false);
      setToast({ show: false, message: '', type: 'error' });
    }
  }, [isOpen]);

  // Close modal if escape key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle PAN verification from uploaded image
  const handlePANVerification = async (imageData) => {
    try {
      setLoading(true);
      
      // In a real app, send the image to the backend for OCR processing
      const response = await extractPANDetails(imageData).unwrap();
      
      if (response.success) {
        const { name, pan, dateOfBirth } = response.data;
        
        // Calculate age from date of birth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth() || 
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
          age--;
        }
        
        if (age < 18) {
          showToast('You must be at least 18 years old to register', 'error');
          setLoading(false);
          return;
        }
        
        setUserData({
          ...userData,
          name: name || '',
          pan: pan || '',
          dateOfBirth: dateOfBirth || '',
          age: age.toString() || '',
        });
        
        setStep(2); // Move to registration form
      } else {
        throw new Error(response.message || 'Failed to extract PAN details');
      }
    } catch (error) {
      console.error('PAN verification error:', error);
      showToast('Failed to extract details from PAN card. Please try again or enter details manually.');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual entry (skip OCR)
  const handleManualEntry = () => {
    setStep(2); // Move to registration form
  };

  // Handle form submission
  const handleFormSubmit = (formData) => {
    // Verify age is at least 18
    if (parseInt(formData.age, 10) < 18) {
      showToast('You must be at least 18 years old to register', 'error');
      return;
    }
    
    setUserData({ ...userData, ...formData });
    setStep(3); // Move to password setup
  };

  // Handle password setup
  const handlePasswordSetup = (password, isStrong) => {
    if (!isStrong) {
      showToast('Please choose a stronger password that meets all the requirements', 'error');
      return;
    }
    
    setUserData({ ...userData, password });
    setStep(4); // Move to OTP verification
  };

  // Handle OTP verification
  const handleOTPVerify = async () => {
    setLoading(true);
    try {
      // Format the data as expected by the backend
      const formattedData = {
        ...userData,
        dateOfBirth: userData.dateOfBirth, // Ensure it's in the proper format
      };

      console.log('Submitting registration data:', formattedData);
      
      // Make API call to register user
      const response = await registerUser(formattedData).unwrap();
      console.log('Registration response:', response);
      
      if (response.success) {
        setSuccess(true);
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.data && error.data.message) {
        errorMessage = error.data.message;
      }
      
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Back button - show for steps 2-4 */}
        {step > 1 && !success && (
          <button 
            onClick={goBack}
            className="absolute top-4 left-4 text-white/70 hover:text-white transition-colors z-10 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">Back</span>
          </button>
        )}

        {/* Title bar */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-5">
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${step >= i ? 'bg-white text-emerald-600' : 'bg-white/30 text-white'}`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div 
                    className={`h-[2px] w-12 ${step > i ? 'bg-white' : 'bg-white/30'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="min-h-[500px] flex flex-col">
          {step === 1 && (
            <PANVerification 
              onVerification={handlePANVerification} 
              onManualEntry={handleManualEntry}
              loading={loading}
            />
          )}

          {step === 2 && (
            <RegistrationForm 
              initialData={userData} 
              onSubmit={handleFormSubmit} 
            />
          )}

          {step === 3 && (
            <PasswordSetup 
              onSubmit={handlePasswordSetup} 
            />
          )}

          {step === 4 && !success && (
            <OTPVerification 
              phone={userData.phone} 
              onVerify={handleOTPVerify} 
              loading={loading}
            />
          )}

          {success && (
            <div className="flex flex-col items-center justify-center p-6 h-[500px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="w-24 h-24 text-emerald-400 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Registration Successful!</h3>
              <p className="text-gray-400 text-center">
                Your account has been created successfully with<br />an initial balance of <span className="text-emerald-400 font-semibold">₹1,50,000</span>
              </p>
              <p className="text-white/60 text-center mt-6">
                You can now login with your credentials.
              </p>
            </div>
          )}
        </div>

        {/* Toast message */}
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })} 
          />
        )}
      </motion.div>
    </div>
  );
};

export default RegisterModal;
