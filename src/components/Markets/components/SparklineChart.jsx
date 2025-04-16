import React from "react";

const SparklineChart = ({ data, width = 100, height = 30, color }) => {
  if (!data || data.length === 0) return null;

  const prices = data.map((item) => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;

  const normalizedPrices =
    range === 0
      ? prices.map(() => height / 2)
      : prices.map((price) => height - ((price - minPrice) / range) * height);

  const points = normalizedPrices
    .map((price, i) => `${(i / (prices.length - 1)) * width},${price}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Background grid lines */}
      <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f0f0f0" strokeWidth="1" strokeDasharray="2,2" />
      
      {/* Sparkline */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      
      {/* Gradient fill below the line */}
      <polygon
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
        points={`0,${height} ${points} ${width},${height}`}
        opacity="0.5"
      />
      
      {/* Highlight last point */}
      <circle 
        cx={width} 
        cy={normalizedPrices[normalizedPrices.length-1]} 
        r="2" 
        fill={color} 
      />
    </svg>
  );
};

export default SparklineChart;
