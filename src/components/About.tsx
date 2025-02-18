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
          <h2 className="text-2xl font-bold text-gray-900">About FinanceSeer</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="prose max-w-none text-gray-600">
          <p>
            FinanceSeer is a revolutionary financial management platform that simplifies how you track and manage your finances across multiple bank accounts. By simply connecting your PAN card, you get instant access to all your linked bank accounts in one place.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            To empower users with intelligent financial insights and tools that help them make better financial decisions and achieve their financial goals.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>Single PAN card integration for multiple bank accounts</li>
            <li>Advanced analytics and spending pattern analysis</li>
            <li>Custom saving pots for goal-based savings</li>
            <li>AI-powered financial advice and market insights</li>
            <li>Rewards program for smart financial decisions</li>
          </ul>

          <h3>Security</h3>
          <p>
            FinanceSeer prioritizes your financial security with bank-grade encryption and secure authentication protocols. We never store sensitive banking credentials and comply with all relevant financial regulations.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal;
