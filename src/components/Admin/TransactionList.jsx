import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Activity, TrendingUp, ArrowDown, ArrowUp,
  Calendar, ChevronDown, CheckCircle, Clock, XCircle, AlertTriangle,
  BrainCircuit, Share2, Eye, Layers, BarChart2, FileText, DollarSign
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY;

const TransactionList = ({ transactionStats, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [dateRange, setDateRange] = useState('all');

  const processedTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return [];
    }
    
    return transactions.map(tx => ({
      id: tx._id || tx.id || `tx-${Math.random().toString(36).substr(2, 9)}`,
      date: tx.date || tx.createdAt || new Date().toISOString(),
      senderName: tx.senderName || tx.sender?.name || 'Unknown',
      senderId: tx.senderId || tx.sender?._id || 'system',
      receiverName: tx.receiverName || tx.receiver?.name || 'Unknown',
      receiverId: tx.receiverId || tx.receiver?._id || 'system',
      amount: tx.amount || 0,
      type: tx.type || 'transfer',
      status: tx.status || 'completed'
    }));
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = processedTransactions.filter(tx => {
      const matchesSearch = 
        (tx.senderName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (tx.receiverName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tx.amount?.toString() || '').includes(searchTerm) ||
        (tx.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      return matchesSearch && tx.type === filterType;
    });
    
    let dateFiltered = filtered;
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch(dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'quarter':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        dateFiltered = filtered.filter(tx => new Date(tx.date) >= cutoffDate);
      }
    }
    
    return dateFiltered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'amount':
          valueA = a.amount || 0;
          valueB = b.amount || 0;
          break;
        case 'sender':
          valueA = a.senderName || '';
          valueB = b.senderName || '';
          break;
        case 'receiver':
          valueA = a.receiverName || '';
          valueB = b.receiverName || '';
          break;
        case 'date':
        default:
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [processedTransactions, searchTerm, filterType, sortBy, sortDirection, dateRange]);

  const analyzeTransactionWithAI = async (transaction) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this bank transaction and provide insights:
                
                Transaction ID: ${transaction.id}
                Date: ${transaction.date}
                Sender: ${transaction.senderName || 'Unknown'} (ID: ${transaction.senderId})
                Receiver: ${transaction.receiverName || 'Unknown'} (ID: ${transaction.receiverId})
                Amount: ${transaction.amount}
                Type: ${transaction.type}
                Status: ${transaction.status}
                
                Please provide:
                1. Transaction risk assessment (Low/Medium/High)
                2. Potential transaction purpose
                3. Any unusual patterns to look for
                4. Recommendations for bank admin
                5. Similar transaction types in banking context
                
                Format the response in clearly separated sections.`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setAiAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAiAnalysis("Unable to generate insights for this transaction. Please try again later.");
      }
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      setAiAnalysis("Error analyzing transaction. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const transactionAnalytics = useMemo(() => {
    if (!processedTransactions.length) {
      return {
        totalAmount: 0,
        avgAmount: 0,
        maxAmount: 0,
        typeDistribution: {},
        statusDistribution: {}
      };
    }
    
    const totalAmount = processedTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const avgAmount = totalAmount / processedTransactions.length;
    const maxAmount = Math.max(...processedTransactions.map(tx => tx.amount || 0));
    
    const typeDistribution = processedTransactions.reduce((acc, tx) => {
      const type = tx.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const statusDistribution = processedTransactions.reduce((acc, tx) => {
      const status = tx.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalAmount,
      avgAmount,
      maxAmount,
      typeDistribution,
      statusDistribution
    };
  }, [processedTransactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const TransactionDetailModal = ({ transaction, onClose }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 10 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
              transaction.type === 'withdrawal' ? 'bg-amber-100 text-amber-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1) || 'Transaction'}</h3>
              <p className="text-sm text-gray-500">ID: {transaction.id?.substring(0, 12)}...</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              onClick={() => {
                setShowTransactionModal(false);
                setShowAIAnalysis(true);
                if (!aiAnalysis) {
                  analyzeTransactionWithAI(transaction);
                }
              }}
            >
              <BrainCircuit className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(transaction.amount)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
              transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              transaction.status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1) || 'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                setShowTransactionModal(false);
                setShowAIAnalysis(true);
                if (!aiAnalysis) {
                  analyzeTransactionWithAI(transaction);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                AI Analysis
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const AIAnalysisModal = ({ transaction, analysis, isLoading, onClose }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 10 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-indigo-500 rounded-lg">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Transaction Analysis</h3>
              <p className="text-sm text-gray-500">
                Transaction ID: {transaction.id?.substring(0, 12)}...
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
              />
              <p className="text-gray-500">Analyzing transaction with AI...</p>
            </div>
          ) : analysis ? (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: analysis
                  .replace(/\n/g, '<br>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/#{1,6}\s+(.*?)(\n|$)/g, '<h4>$1</h4>')
              }}/>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-gray-500">No analysis available</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
          <button 
            className="px-4 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm hover:bg-indigo-100"
            onClick={() => analyzeTransactionWithAI(transaction)}
          >
            Refresh Analysis
          </button>
          <button 
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
            <p className="text-sm text-gray-500">Manage and monitor all bank transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnalyticsPanel(!showAnalyticsPanel)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-100 flex items-center gap-2"
          >
            <BarChart2 className="h-4 w-4" />
            Analytics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAnalyticsPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Transaction Analytics</h3>
                <button 
                  onClick={() => setShowAnalyticsPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-800">{processedTransactions.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Total Volume</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(transactionAnalytics.totalAmount)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Average Amount</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatCurrency(transactionAnalytics.avgAmount)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Largest Transaction</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(transactionAnalytics.maxAmount)}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Transaction Types</h4>
                  <div className="space-y-3">
                    {Object.entries(transactionAnalytics.typeDistribution).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            type === 'deposit' ? 'bg-green-500' : 
                            type === 'withdrawal' ? 'bg-amber-500' : 
                            type === 'transfer' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm text-gray-600 capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(count / processedTransactions.length * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Transaction Status</h4>
                  <div className="space-y-3">
                    {Object.entries(transactionAnalytics.statusDistribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'completed' ? 'bg-green-500' : 
                            status === 'pending' ? 'bg-amber-500' : 
                            status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm text-gray-600 capitalize">{status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(count / processedTransactions.length * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterType === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterType === 'deposit' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
              onClick={() => setFilterType('deposit')}
            >
              Deposits
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterType === 'withdrawal' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600'}`}
              onClick={() => setFilterType('withdrawal')}
            >
              Withdrawals
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterType === 'transfer' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
              onClick={() => setFilterType('transfer')}
            >
              Transfers
            </button>
          </div>
          <div className="relative">
            <button 
              className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 flex items-center gap-2"
              onClick={() => document.getElementById('dateFilter').classList.toggle('hidden')}
            >
              <Calendar className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
            <div id="dateFilter" className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 w-48 py-2 z-10 hidden">
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase">Date Range</p>
              </div>
              {['all', 'today', 'week', 'month', 'quarter'].map(range => (
                <button 
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    document.getElementById('dateFilter').classList.add('hidden');
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${dateRange === range ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {range === 'all' ? 'All Time' : 
                   range === 'today' ? 'Today' :
                   range === 'week' ? 'Last 7 Days' :
                   range === 'month' ? 'Last 30 Days' : 'Last Quarter'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="py-3 px-4 font-medium">Transaction ID</th>
                <th 
                  className="py-3 px-4 font-medium cursor-pointer" 
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortBy === 'date' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-medium cursor-pointer"
                  onClick={() => handleSort('sender')}
                >
                  <div className="flex items-center gap-1">
                    From
                    {sortBy === 'sender' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-medium cursor-pointer"
                  onClick={() => handleSort('receiver')}
                >
                  <div className="flex items-center gap-1">
                    To
                    {sortBy === 'receiver' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-medium cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    {sortBy === 'amount' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedTransactions.map((tx, index) => (
                <motion.tr 
                  key={tx.id || index} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedTransaction(tx);
                    setShowTransactionModal(true);
                  }}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                >
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{tx.id?.substring(0, 10)}...</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(tx.date).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs">
                        {tx.senderName?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <span className="text-gray-700">{tx.senderName || tx.senderId || 'System'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-xs">
                        {tx.receiverName?.charAt(0)?.toUpperCase() || 'R'}
                      </div>
                      <span className="text-gray-700">{tx.receiverName || tx.receiverId || 'System'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : ''}
                      ${tx.type === 'withdrawal' ? 'bg-amber-100 text-amber-700' : ''}
                      ${tx.type === 'transfer' ? 'bg-indigo-100 text-indigo-700' : ''}
                      ${!tx.type ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {tx.type || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                      ${tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                      ${tx.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                      ${tx.status === 'flagged' ? 'bg-orange-100 text-orange-700' : ''}
                      ${!tx.status ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                      {tx.status || 'Completed'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(tx);
                          setShowAIAnalysis(true);
                          analyzeTransactionWithAI(tx);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        title="AI Analysis"
                      >
                        <BrainCircuit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(tx);
                          setShowTransactionModal(true);
                        }}
                        className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredAndSortedTransactions.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No transactions found matching your filters</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setDateRange('all');
                  }}
                  className="mt-2 text-blue-500 text-sm hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 py-3 px-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            <span className="font-medium">Total Transactions:</span> {processedTransactions.length}
            {searchTerm || filterType !== 'all' || dateRange !== 'all' ? (
              <span className="ml-2">
                (Filtered: {filteredAndSortedTransactions.length})
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTransactionModal && selectedTransaction && (
          <TransactionDetailModal 
            transaction={selectedTransaction} 
            onClose={() => setShowTransactionModal(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIAnalysis && selectedTransaction && (
          <AIAnalysisModal 
            transaction={selectedTransaction}
            analysis={aiAnalysis}
            isLoading={isAnalyzing}
            onClose={() => setShowAIAnalysis(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
