import React from "react";
import FlexBetween from "./FlexBetween";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} props.sideText
 */
const BoxHeader = ({ title, subtitle, sideText }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <span className="text-sm font-medium text-green-600">{sideText}</span>
    </div>
  );
};

export default BoxHeader;
