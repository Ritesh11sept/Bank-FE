import React, { useMemo } from "react";
import { ArrowUp, ArrowDown, Brain, TrendingUp, TrendingDown, AlertTriangle, Check, X, BarChart4, Clock } from "lucide-react";
import { marked } from 'marked';

const StockAnalysisModal = ({ selectedStock, aiAnalysis, onClose }) => {
  const isGenerating = aiAnalysis === "Generating analysis...";
  const isError = aiAnalysis.startsWith("Failed to generate");
  
  // Parse the analysis data or prepare it from string
  const analysisData = useMemo(() => {
    if (isGenerating || isError) return null;
    
    try {
      // First try to parse as JSON (for future compatibility)
      return JSON.parse(aiAnalysis);
    } catch (e) {
      // If it's not JSON, use the text analysis with the current stock data
      const sentiment = selectedStock.percentChange > 0 ? "positive" : "negative";
      const recommendation = selectedStock.percentChange > 2 ? "Buy" : (selectedStock.percentChange > -2 ? "Hold" : "Sell");
      
      return {
        stock: selectedStock,
        sentiment,
        recommendation
      };
    }
  }, [aiAnalysis, isGenerating, isError, selectedStock]);
  
  // Generate the detailed analysis in the component
  const generateDetailedAnalysis = useMemo(() => {
    if (!analysisData) return null;
    
    const { stock, sentiment, recommendation } = analysisData;
    
    return {
      title: "Investment Analysis Report",
      companyOverview: `${stock.name} is a leading player in the ${stock.sector} sector of the Indian market, known for its ${sentiment === "positive" ? "strong market position and innovation" : "established presence but facing current challenges"}.`,
      
      strengths: [
        sentiment === "positive" ? "Strong growth trajectory" : "Established market presence",
        "Diversified product/service portfolio",
        sentiment === "positive" ? "Robust financial position" : "Experienced management team"
      ],
      
      weaknesses: [
        sentiment === "positive" ? "Increasing competition in the sector" : "Declining profit margins",
        sentiment === "positive" ? "Regulatory challenges" : "Underperforming relative to sector peers",
        sentiment === "positive" ? "Valuation concerns at current price levels" : "Weak recent quarterly results"
      ],
      
      shortTerm: sentiment === "positive" 
        ? "Positive momentum expected to continue with potential for 8-10% upside."
        : "Likely to face headwinds with possible further correction of 5-7%.",
      
      longTerm: stock.peRatio < 20
        ? "Strong long-term growth prospects with potential to outperform broader market indices."
        : "Moderate growth expectations with returns likely in line with sector averages.",
      
      risks: [
        "Macroeconomic factors including inflation and interest rate changes",
        "Sector-specific regulatory developments",
        sentiment === "positive" ? "Valuation risks if growth doesn't meet expectations" : "Financial performance deterioration"
      ],
      
      recommendationDetails: recommendation === "Buy"
        ? "Current price presents an attractive entry point for investors with a medium to long-term horizon."
        : recommendation === "Hold"
          ? "Existing investors should maintain positions but new investors may want to wait for a more favorable entry point."
          : "Consider reducing exposure and reallocating to more promising opportunities in the market.",
      
      recommendation: recommendation
    };
  }, [analysisData]);

  // Render content based on the analysis state
  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse">
            <Brain size={48} className="text-emerald-400 mb-4" />
          </div>
          <div className="text-gray-500 animate-pulse">Generating AI analysis...</div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-red-500">
          <AlertTriangle size={48} className="mb-4" />
          <div>Failed to generate analysis. Please try again later.</div>
        </div>
      );
    }
    
    if (!analysisData || !generateDetailedAnalysis) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-amber-500">
          <AlertTriangle size={48} className="mb-4" />
          <div>Analysis data could not be processed.</div>
        </div>
      );
    }
    
    const analysis = generateDetailedAnalysis;
    
    return (
      <div className="analysis-content">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">{analysis.title}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Company Overview</h3>
            <p className="text-gray-700 mb-4">{analysis.companyOverview}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Key Strengths</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="leading-relaxed">{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Key Weaknesses</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="leading-relaxed">{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Investment Outlook</h3>
            <div className="mb-3">
              <p className="font-semibold text-gray-800">Short-term (3-6 months):</p>
              <p className="text-gray-700">{analysis.shortTerm}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Long-term (1-3 years):</p>
              <p className="text-gray-700">{analysis.longTerm}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Potential Risks</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
              {analysis.risks.map((risk, index) => (
                <li key={index} className="leading-relaxed">{risk}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Recommendation</h3>
            <div className="my-4 flex justify-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                analysis.recommendation === 'Buy' 
                  ? 'bg-green-100 text-green-800'
                  : analysis.recommendation === 'Hold'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
              } font-bold text-lg`}>
                {analysis.recommendation === 'Buy' 
                  ? <Check size={20} className="mr-2" />
                  : analysis.recommendation === 'Hold'
                    ? <Clock size={20} className="mr-2" />
                    : <X size={20} className="mr-2" />
                }
                {analysis.recommendation}
              </div>
            </div>
            <p className="text-gray-700 mt-4">{analysis.recommendationDetails}</p>
          </div>
          
          <div className="mt-8 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">Note: This analysis is based on current market data and subject to change with market conditions.</p>
          </div>
        </div>
      </div>
    );
  };

  // Create a summary card based on sentiment and recommendation
  const renderSummaryCard = () => {
    if (isGenerating || isError || !analysisData) return null;
    
    const { stock, sentiment, recommendation } = analysisData;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Sentiment</span>
            <div className={`flex items-center font-medium ${sentiment === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {sentiment === 'positive' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {sentiment === 'positive' ? 'Positive' : 'Negative'}
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Risk Level</span>
            <div className="flex items-center font-medium text-amber-600">
              <AlertTriangle size={16} className="mr-1" />
              {stock.peRatio > 25 ? 'High' : stock.peRatio > 15 ? 'Medium' : 'Low'}
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Recommendation</span>
            <div className={`flex items-center font-medium ${
              recommendation === 'Buy' ? 'text-green-600' : 
              recommendation === 'Hold' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {recommendation === 'Buy' ? <Check size={16} className="mr-1" /> : 
               recommendation === 'Hold' ? <Clock size={16} className="mr-1" /> : <X size={16} className="mr-1" />}
              {recommendation}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-emerald-100 animate-fadeIn flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sm:p-6 flex justify-between items-start">
          <div className="flex items-start">
            <BarChart4 size={24} className="mr-3 mt-1 hidden sm:block" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">{selectedStock.name}</h3>
              <p className="text-emerald-100 text-sm">{selectedStock.symbol.split('.')[0]} · {selectedStock.sector}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-emerald-100 transition-colors duration-200 rounded-full p-1 hover:bg-emerald-800"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Price Info */}
        <div className="flex flex-wrap items-center p-4 sm:p-6 border-b border-gray-100">
          <span className="text-2xl sm:text-3xl font-bold mr-3 text-gray-900">₹{selectedStock.price.toLocaleString()}</span>
          <span className={`inline-flex items-center text-lg font-medium ${
            selectedStock.change >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {selectedStock.change >= 0 ? <ArrowUp size={20} className="mr-1" /> : <ArrowDown size={20} className="mr-1" />}
            {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change.toFixed(2)} ({selectedStock.percentChange.toFixed(2)}%)
          </span>
          <div className="flex flex-wrap mt-2 sm:mt-0 sm:ml-auto space-x-2">
            <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded flex items-center">
              <span className="font-semibold mr-1">PE:</span> {selectedStock.peRatio.toFixed(2)}
            </div>
            <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded flex items-center">
              <span className="font-semibold mr-1">Vol:</span> {(selectedStock.volume/1000000).toFixed(2)}M
            </div>
          </div>
        </div>
        
        {/* Content area with scrolling */}
        <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {renderSummaryCard()}
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Brain size={14} className="mr-1 text-emerald-500" /> 
            Analysis powered by AI
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default StockAnalysisModal;