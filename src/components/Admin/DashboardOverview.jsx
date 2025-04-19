import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, AlertTriangle, TrendingUp, Activity, DollarSign, Info,
  CheckCircle, RefreshCw, Download, ArrowUp, ArrowDown, Clock,
  Eye, AlertOctagon, ShieldCheck, Tag, Shield, Zap, CreditCard,
  BarChart4, Calendar, Landmark
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import FraudDetection from './FraudDetection';

const API_KEY = import.meta.env.VITE_API_KEY;

const DashboardOverview = ({ stats, transactionStats, potStats, flaggedTransactions, transactions }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processedTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    
    return transactions.slice(0, 10).map(tx => ({
      id: tx._id || tx.id || `tx-${Math.random().toString(36).substr(2, 9)}`,
      date: tx.date || tx.createdAt || new Date().toISOString(),
      amount: tx.amount || 0,
      userId: tx.userId || tx.senderId || 'unknown',
      type: tx.type || 'transfer',
      status: tx.status || 'completed'
    }));
  }, [transactions]);

  const volumeByMonth = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return Array(6).fill(0).map((_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        volume: 0
      }));
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = Array(6).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      return {
        month: monthNames[monthIndex],
        volume: 0
      };
    }).reverse();

    transactions.forEach(tx => {
      if (!tx.date && !tx.createdAt) return;
      
      const date = new Date(tx.date || tx.createdAt);
      const monthName = monthNames[date.getMonth()];
      const monthEntry = last6Months.find(m => m.month === monthName);
      
      if (monthEntry) {
        monthEntry.volume += parseFloat(tx.amount) || 0;
      }
    });

    return last6Months;
  }, [transactions]);

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionTrend = (data) => {
    if (!data || data.length < 2) return 0;
    const lastTwo = data.slice(-2);
    return ((lastTwo[1].volume - lastTwo[0].volume) / lastTwo[0].volume) * 100;
  };

  const enhancedChartData = useMemo(() => {
    return volumeByMonth.map(item => ({
      ...item,
      volume: item.volume || 0,
      average: volumeByMonth.reduce((acc, curr) => acc + (curr.volume || 0), 0) / volumeByMonth.length
    }));
  }, [volumeByMonth]);

  const analyzeTransaction = async (transaction) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this transaction for potential fraud:
                Amount: ${transaction.amount}
                User ID: ${transaction.userId}
                Time: ${transaction.date}
                Type: ${transaction.type}
                
                Provide a fraud analysis with:
                1. Risk level (Low/Medium/High)
                2. Confidence score (0-100)
                3. Key risk factors
                4. Recommended action
                
                Format as JSON`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      return null;
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, shadowClass }) => {
    return (
      <motion.div 
        whileHover={{ y: -5, boxShadow: shadowClass }}
        className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 overflow-hidden relative`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className={`${bgClass} p-2 rounded-lg`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </motion.div>
    );
  };

  const TransactionTypeDistribution = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A65EEA'];
    
    const data = [
      { name: 'Transfers', value: 40 },
      { name: 'Payments', value: 30 },
      { name: 'Withdrawals', value: 15 },
      { name: 'Deposits', value: 10 },
      { name: 'Others', value: 5 }
    ];
    
    return (
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{payload[0].name}</p>
                      <p className="text-lg font-bold text-blue-600">
                        {payload[0].value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  const calculatedStats = {
    ...stats,
    totalTransactions: transactions?.length || 0,
    totalVolume: transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0,
    transactionGrowthRate: stats.transactionGrowthRate || 5,
    volumeGrowthRate: stats.volumeGrowthRate || 3.2
  };

  const displayedTransactions = processedTransactions.length > 0 ? 
    processedTransactions : 
    (flaggedTransactions || []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="mt-1 text-blue-100">Overview of your banking system and transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-700/30 rounded-lg hover:bg-blue-700/50 transition-colors"
            >
              <Calendar className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Volume', value: formatCurrency(calculatedStats.totalVolume), icon: DollarSign },
            { label: 'Transactions', value: calculatedStats.totalTransactions, icon: Activity },
            { label: 'Avg. Transaction', value: formatCurrency(calculatedStats.totalVolume / Math.max(calculatedStats.totalTransactions, 1)), icon: CreditCard },
            { label: 'Growth Rate', value: `${calculatedStats.transactionGrowthRate}%`, icon: TrendingUp }
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-blue-100">{stat.label}</h3>
                <div className="p-1.5 bg-white/20 rounded-md">
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="mt-2 text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

     
      {/* Fraud Detection System */}
      <FraudDetection 
        transactions={transactions}
        flaggedTransactions={flaggedTransactions}
        formatCurrency={formatCurrency}
      />

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Transaction Volume</h2>
              <p className="text-sm text-gray-500">Last 6 months activity</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center text-sm text-gray-500 border rounded-lg overflow-hidden">
                <button className="px-3 py-1 hover:bg-gray-50">Day</button>
                <button className="px-3 py-1 hover:bg-gray-50">Week</button>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 font-medium">Month</button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg"
              >
                <BarChart4 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enhancedChartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                          <p className="text-sm text-gray-600">{payload[0].payload.month}</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(payload[0].value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#3B82F6"
                  fill="url(#colorVolume)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#6B7280"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction Insights</h3>
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-sm font-bold text-blue-600">98.5%</span>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.5%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-green-100 rounded-full mr-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Successful</p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {calculatedStats.totalTransactions}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-50/50 rounded-lg border border-red-100">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-red-100 rounded-full mr-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
                <p className="text-lg font-bold text-red-600">
                  {Math.round(calculatedStats.totalTransactions * 0.015)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Landmark className="h-4 w-4 mr-1 text-gray-400" />
                Transaction Types
              </h4>
              <TransactionTypeDistribution />
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-1 text-gray-400" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {displayedTransactions.slice(0, 3).map((tx, index) => (
                  <motion.div
                    key={tx.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.status === 'completed' ? 'bg-green-100' : 'bg-amber-100'
                      }`}>
                        {tx.status === 'completed' ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <Clock className="h-4 w-4 text-amber-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors border border-gray-200"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Fraud Analysis</h3>
              <p className="text-sm text-gray-600 mb-2">Transaction ID: {selectedAlert.id}</p>
              <p className="text-sm text-gray-600 mb-2">Risk Level: {selectedAlert.riskLevel}</p>
              <p className="text-sm text-gray-600 mb-2">Confidence Score: {selectedAlert.confidenceScore}%</p>
              <p className="text-sm text-gray-600 mb-2">Key Risk Factors: {selectedAlert.keyRiskFactors}</p>
              <p className="text-sm text-gray-600 mb-2">Recommended Action: {selectedAlert.recommendedAction}</p>
              <button
                onClick={() => setSelectedAlert(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardOverview;
