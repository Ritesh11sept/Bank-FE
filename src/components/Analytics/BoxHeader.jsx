import React from 'react';

const BoxHeader = ({ title, subtitle, sideText, icon }) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-base font-medium text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center">
        {sideText && <span className="text-sm font-medium text-gray-600">{sideText}</span>}
        {icon && <span className="ml-2">{icon}</span>}
      </div>
    </div>
  );
};

export default BoxHeader;
