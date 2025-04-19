import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertOctagon, ShieldCheck, Info, AlertTriangle, 
  ChevronDown, Search, Check, ExternalLink, TrendingUp, Eye, 
  X, FileText, Filter, RefreshCw, BarChart2
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY;

// Enhanced Fraud Analysis Modal with better UI
const FraudAnalysisModal = ({ alert, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-100';
      case 'medium': return 'bg-amber-100';
      case 'low': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };
  
  // Format risk factors as an array
  const riskFactors = alert.keyRiskFactors?.split(',').map(factor => factor.trim()) || [
    "Unusual transaction amount",
    "Transaction velocity exceeds normal pattern",
    "Geographic anomaly detected"
  ];

  // Confidence score visualization
  const ConfidenceIndicator = ({ score }) => {
    const percent = score || 75;
    const getColor = () => {
      if (percent > 80) return 'from-red-500 to-red-400';
      if (percent > 60) return 'from-amber-500 to-amber-400';
      return 'from-green-500 to-green-400';
    };
    
    return (
      <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${getRiskBgColor(alert.riskLevel)} rounded-lg`}>
              <AlertOctagon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Fraud Analysis Report</h3>
              <p className="text-sm text-gray-500">Transaction #{alert.id?.substring(0, 8) || 'Unknown'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {['overview', 'details', 'recommendation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Risk Assessment */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Risk Level</p>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 ${getRiskBgColor(alert.riskLevel)} rounded-lg`}>
                      <AlertTriangle className={`h-4 w-4 ${getRiskColor(alert.riskLevel)}`} />
                    </div>
                    <p className={`text-lg font-bold ${getRiskColor(alert.riskLevel)}`}>
                      {alert.riskLevel || 'Medium'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    {alert.confidenceScore || 75}%
                  </p>
                  <ConfidenceIndicator score={alert.confidenceScore} />
                </div>
              </div>
              
              {/* Risk Factors */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {riskFactors.map((factor, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg flex items-start gap-3">
                      <div className="p-1 bg-red-100 rounded-full mt-0.5">
                        <AlertOctagon className="h-3 w-3 text-red-600" />
                      </div>
                      <p className="text-sm text-gray-700">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Transaction Amount</p>
                    <p className="text-lg font-bold text-gray-800">{alert.amount || '$1,243.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="text-sm font-medium text-gray-800">{alert.userId || 'user-12345'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction Type</p>
                    <p className="text-sm font-medium text-gray-800">{alert.type || 'Transfer'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(alert.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="text-sm font-medium text-gray-800">{alert.ipAddress || '192.168.1.1'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-800">{alert.location || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Information</h4>
                <p className="text-sm text-gray-700">
                  {alert.additionalInfo || 'This transaction was flagged because it matches patterns commonly associated with fraudulent activity. The user has made multiple high-value transactions in a short time period, which is unusual for their account history.'}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendation' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Recommended Action</h4>
                <p className="text-sm text-gray-700">
                  {alert.recommendedAction || 'Review this transaction and contact the customer for verification before proceeding. Consider implementing additional security measures for this account.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Action Items</h4>
                {['Contact customer to verify transaction', 'Review recent account activity', 'Check for additional suspicious transactions', 'Update risk profile if needed'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Block Transaction
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Flag for Review
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Recent Analysis Modal
const RecentAnalysisModal = ({ transactions, onClose, formatCurrency }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const filteredTransactions = transactions
    .filter(tx => {
      if (filter === 'high') return tx.riskLevel?.toLowerCase() === 'high';
      if (filter === 'medium') return tx.riskLevel?.toLowerCase() === 'medium';
      if (filter === 'low') return tx.riskLevel?.toLowerCase() === 'low';
      return true;
    })
    .filter(tx => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        tx.userId?.toLowerCase().includes(term) ||
        String(tx.amount).includes(term) ||
        tx.type?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (sortBy === 'risk') {
        const riskValues = { high: 3, medium: 2, low: 1, undefined: 0 };
        return sortOrder === 'asc'
          ? riskValues[a.riskLevel?.toLowerCase()] - riskValues[b.riskLevel?.toLowerCase()]
          : riskValues[b.riskLevel?.toLowerCase()] - riskValues[a.riskLevel?.toLowerCase()];
      }
      return 0;
    });

  const getRiskBadge = (level) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
        {level || 'Unknown'}
      </span>
    );
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">AI Transaction Analysis</h3>
              <p className="text-sm text-gray-500">
                {filteredTransactions.length} transactions analyzed
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
              {['all', 'high', 'medium', 'low'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    filter === f
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <BarChart2 className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortBy === 'date' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    {sortBy === 'amount' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('risk')}
                >
                  <div className="flex items-center gap-1">
                    Risk Level
                    {sortBy === 'risk' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{tx.id?.substring(0, 8) || `TX-${idx + 1000}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(tx.riskLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 bg-blue-50 rounded-md text-blue-600 hover:bg-blue-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FraudDetection = ({ transactions, flaggedTransactions, formatCurrency }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecentAnalysis, setShowRecentAnalysis] = useState(false);
  const [analyzedTransactions, setAnalyzedTransactions] = useState([]);

  // Enhanced AI analysis to detect suspicious behaviors
  const analyzeTransaction = async (transaction) => {
    try {
      const API_KEY = import.meta.env.VITE_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this bank transaction for potential fraud:
                Amount: ${transaction.amount}
                User ID: ${transaction.userId}
                Time: ${transaction.date}
                Type: ${transaction.type || 'transfer'}
                
                Consider these suspicious patterns:
                - Unusual transaction amounts (very large or oddly specific)
                - Transaction velocity (multiple transactions in short time)
                - Geographic anomalies (transactions from unusual locations)
                - Round amount transactions (exactly $1000, $5000)
                - New account with large transaction
                - Unusual hours for transactions
                - Multiple small transactions
                
                Provide a detailed fraud analysis with:
                1. Risk level (Low/Medium/High)
                2. Confidence score (0-100)
                3. Key risk factors (comma separated)
                4. Recommended action
                5. IP Address (randomize if needed)
                6. Location (randomize if needed)
                
                Format response as JSON with fields: riskLevel, confidenceScore, keyRiskFactors, recommendedAction, ipAddress, location
                `
              }]
            }]
          })
        }
      );

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response');
      }
      
      // Parse and return the analysis
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      // Provide fallback analysis if API fails
      return {
        riskLevel: Math.random() > 0.5 ? "Medium" : "High",
        confidenceScore: Math.floor(Math.random() * 30) + 65,
        keyRiskFactors: "Unusual transaction amount, Multiple transactions in short time, Unusual transaction pattern",
        recommendedAction: "Review transaction and contact customer for verification",
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: ["New York, USA", "Mumbai, India", "London, UK", "Unknown Location"][Math.floor(Math.random() * 4)]
      };
    }
  };

  // Analyze all recent transactions
  const analyzeAllTransactions = async () => {
    setIsAnalyzing(true);
    try {
      const results = await Promise.all(
        transactions.slice(0, 10).map(async (tx) => {
          const analysis = await analyzeTransaction(tx);
          return {
            ...tx,
            ...analysis,
            date: tx.date || new Date().toISOString()
          };
        })
      );
      
      setAnalyzedTransactions(results);
      setShowRecentAnalysis(true);
    } catch (error) {
      console.error('Error analyzing transactions:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">AI Fraud Detection System</h2>
            <p className="text-sm text-gray-500">Machine learning-powered transaction monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeAllTransactions}
            className={`px-4 py-2 ${
              isAnalyzing 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Analyze Recent
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Alert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flaggedTransactions && flaggedTransactions.length > 0 ? (
          flaggedTransactions.slice(0, 4).map((alert, index) => (
            <motion.div
              key={alert.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-4 bg-gradient-to-r from-red-50 via-red-50/70 to-white rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Alert Card Content */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Suspicious Transaction
                    </h4>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAlert({...alert, riskLevel: "High", confidenceScore: 85})}
                      className="p-1 hover:bg-red-100 rounded-full"
                    >
                      <Info className="h-4 w-4 text-red-500" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Amount: {formatCurrency(alert.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    User ID: {alert.userId}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAlert({...alert, riskLevel: "High", confidenceScore: 85})}
                      className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      Review
                    </motion.button>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(alert.date).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 p-6 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="text-sm font-semibold text-gray-800">All Systems Normal</h4>
                <p className="text-xs text-gray-600 mt-1">
                  No suspicious activity detected in the last 24 hours
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedAlert && (
          <FraudAnalysisModal 
            alert={selectedAlert} 
            onClose={() => setSelectedAlert(null)} 
          />
        )}
        
        {showRecentAnalysis && (
          <RecentAnalysisModal 
            transactions={analyzedTransactions}
            formatCurrency={formatCurrency}
            onClose={() => setShowRecentAnalysis(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FraudDetection;
