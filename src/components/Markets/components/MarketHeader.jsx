import React from "react";

const MarketHeader = () => {
  // Mock market indices data
  const marketIndices = [
    { name: "SENSEX", value: "71,234.63", change: "+242.13", percentChange: "+0.34%" },
    { name: "NIFTY 50", value: "21,723.81", change: "+83.75", percentChange: "+0.39%" },
    { name: "NIFTY BANK", value: "46,105.30", change: "+173.95", percentChange: "+0.38%" },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Indian Stock Market
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {marketIndices.map((index) => (
          <div key={index.name} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center">
              <div className="font-medium text-gray-600">{index.name}</div>
              <div className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                {index.percentChange}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{index.value}</div>
              <div className="text-sm text-green-600">{index.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketHeader;
