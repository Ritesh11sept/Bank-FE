import React from 'react';
import { motion } from 'framer-motion';

const KeyMetricsCard = ({ title, value, subtitle, icon, gridArea }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full"
      style={{ gridArea }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-gray-600 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default KeyMetricsCard;
