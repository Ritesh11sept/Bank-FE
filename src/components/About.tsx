import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">About PayEase</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>
            PayEase is a leading digital banking platform in India, revolutionizing the way people manage their finances. Established in 2024, we combine cutting-edge technology with user-friendly interfaces to provide seamless banking solutions.
          </p>
          <p>
            Our mission is to make banking accessible, simple, and secure for everyone. With features like instant UPI payments, AI-driven insights, and comprehensive investment tools, we're building the future of banking.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">10L+</div>
              <div className="text-sm text-emerald-700">Active Users</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">₹100Cr+</div>
              <div className="text-sm text-emerald-700">Daily Transactions</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal;
