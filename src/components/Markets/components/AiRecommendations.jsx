import React from "react";
import { Brain, ArrowUp, ArrowDown, Info, Lightbulb, Award, Percent } from "lucide-react";

const AiRecommendations = ({ recommendations, loading, getStockAnalysis, stocks }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-800 flex items-center">
          <span className="bg-emerald-100 p-1 rounded-md mr-2">
            <Brain size={20} className="text-emerald-600" />
          </span>
          AI Investment Recommendations
        </h2>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-emerald-100">
          <div className="animate-pulse flex flex-col items-center">
            <Brain size={40} className="text-emerald-300 mb-4" />
            <div className="h-4 bg-emerald-100 rounded w-3/4 mb-2.5"></div>
            <div className="h-3 bg-emerald-50 rounded w-1/2"></div>
          </div>
          <div className="text-emerald-600 mt-4">Analyzing market data for investment opportunities...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.symbol}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{recommendation.symbol.split('.')[0]}</h3>
                    <p className="text-emerald-100 text-sm">{recommendation.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">₹{recommendation.price.toLocaleString()}</p>
                    <p
                      className={`flex items-center justify-end ${
                        recommendation.change >= 0 ? "text-green-100" : "text-red-100"
                      }`}
                    >
                      {recommendation.change >= 0 ? (
                        <ArrowUp size={16} className="mr-1" />
                      ) : (
                        <ArrowDown size={16} className="mr-1" />
                      )}
                      {recommendation.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Confidence score badge */}
              <div className="px-4 py-2 bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center">
                  <Award size={16} className="text-emerald-700 mr-1" />
                  <span className="text-sm font-medium text-emerald-800">AI Confidence Score</span>
                </div>
                <div className="flex items-center">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-8 h-8">
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5F7F0"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={`${recommendation.confidence}, 100`}
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-emerald-800">{recommendation.confidence}</span>
                  </div>
                  <Percent size={12} className="text-emerald-600 ml-1" />
                </div>
              </div>
              
              {/* Recommendation reason */}
              <div className="p-4">
                <div className="mb-4 text-gray-700 text-sm flex items-start">
                  <Lightbulb size={16} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{recommendation.reason}</p>
                </div>
                
                {/* Analysis button */}
                <button 
                  onClick={() => {
                    const stock = stocks.find(s => s.symbol === recommendation.symbol);
                    if (stock) getStockAnalysis(stock);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <Info size={16} className="mr-2" />
                  View Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Brief explanation of confidence score */}
      <div className="mt-4 bg-emerald-50 p-3 rounded-lg text-sm text-emerald-700 flex items-start">
        <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
        <p>
          <span className="font-semibold">About Confidence Score:</span> The AI confidence percentage represents how strongly our AI model believes in this recommendation based on technical indicators, market trends, and historical performance analysis.
        </p>
      </div>
    </div>
  );
};

export default AiRecommendations;
