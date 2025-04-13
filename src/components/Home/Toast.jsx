import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-white" />,
    success: <CheckCircle className="w-5 h-5 text-white" />,
  };

  const bgColors = {
    error: 'bg-red-500',
    success: 'bg-emerald-500',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
      >
        <div className={`${bgColors[type]} rounded-lg shadow-lg overflow-hidden max-w-md`}>
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-white text-sm">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="inline-flex text-white focus:outline-none focus:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
