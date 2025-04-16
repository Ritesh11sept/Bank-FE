import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "./DashboardLayout";
import { useGetDetailedTransactionsQuery, useGetUserProfileQuery } from "../../state/api";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import regression from "regression";
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiAward, FiTarget } from "react-icons/fi";

const Predictions = () => {
  const [timeRange, setTimeRange] = useState("month"); // week, month, year
  const [showPredictions, setShowPredictions] = useState(true);
  const { data: transactionData, isLoading: isTransactionLoading } = useGetDetailedTransactionsQuery();
  const { data: userProfile } = useGetUserProfileQuery();
  
  // Format currency to INR
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Process transaction data for insights
  const processedData = useMemo(() => {
    if (!transactionData || !transactionData.transactions) return null;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const userId = localStorage.getItem('userId');

    // Filter transactions based on time range
    const weeklyTransactions = transactionData.transactions.filter(t => 
      new Date(t.date) >= oneWeekAgo
    );
    
    const monthlyTransactions = transactionData.transactions.filter(t => 
      new Date(t.date) >= oneMonthAgo
    );
    
    const prevMonthTransactions = transactionData.transactions.filter(t => 
      new Date(t.date) >= twoMonthsAgo && new Date(t.date) < oneMonthAgo
    );
    
    // Function to calculate insights for a given period
    const calculateInsights = (transactions) => {
      const dailySpending = {};
      const categoriesSpending = {};
      let totalIncome = 0;
      let totalExpense = 0;
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
        const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
        const senderId = String(transaction.senderId?.$oid || transaction.senderId);
        
        const isIncome = receiverId === userId;
        const isExpense = senderId === userId;
        
        // Get category
        let category = 'Other';
        if (transaction.note && typeof transaction.note === 'string') {
          category = transaction.note.toLowerCase().trim();
          if (category.includes(' ')) {
            category = category.split(' ')[0];
          }
          category = category.charAt(0).toUpperCase() + category.slice(1);
        }
        
        if (isIncome) {
          totalIncome += transaction.amount;
        }
        
        if (isExpense) {
          totalExpense += transaction.amount;
          
          // Track daily spending
          dailySpending[day] = (dailySpending[day] || 0) + transaction.amount;
          
          // Track category spending
          categoriesSpending[category] = (categoriesSpending[category] || 0) + transaction.amount;
        }
      });
      
      // Calculate highest spending day
      let highestSpendingDay = { day: 'None', amount: 0 };
      Object.entries(dailySpending).forEach(([day, amount]) => {
        if (amount > highestSpendingDay.amount) {
          highestSpendingDay = { day, amount };
        }
      });
      
      // Sort categories by spending amount
      const topCategories = Object.entries(categoriesSpending)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      
      // Calculate average daily spending
      const uniqueDays = new Set(
        transactions.map(t => new Date(t.date).toLocaleDateString())
      );
      const avgDailySpending = uniqueDays.size > 0 ? totalExpense / uniqueDays.size : 0;
      
      // Number of no-spend days (days with no expenses)
      const daysInPeriod = transactions.length > 0 ? 
        Math.ceil((Math.max(...transactions.map(t => new Date(t.date).getTime())) - 
                  Math.min(...transactions.map(t => new Date(t.date).getTime()))) / 
                  (24 * 60 * 60 * 1000)) + 1 : 0;
      
      const noSpendDays = daysInPeriod - uniqueDays.size;
      
      return {
        totalIncome,
        totalExpense,
        savedAmount: totalIncome - totalExpense,
        topCategories,
        highestSpendingDay,
        avgDailySpending,
        noSpendDays,
        dailySpending,
        daysCount: daysInPeriod
      };
    };
    
    const weeklyInsights = calculateInsights(weeklyTransactions);
    const monthlyInsights = calculateInsights(monthlyTransactions);
    const prevMonthInsights = calculateInsights(prevMonthTransactions);
    
    // Generate spending prediction data
    const generatePredictionData = () => {
      // Aggregate daily spending data for regression
      const dailyData = [];
      transactionData.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = Math.floor(date.getTime() / (24 * 60 * 60 * 1000)); // Convert to day number
        const senderId = String(transaction.senderId?.$oid || transaction.senderId);
        const isExpense = senderId === userId;
        
        if (isExpense) {
          const existingDay = dailyData.find(d => d.day === day);
          if (existingDay) {
            existingDay.amount += transaction.amount;
          } else {
            dailyData.push({ 
              day, 
              date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
              amount: transaction.amount 
            });
          }
        }
      });
      
      // Sort by day
      dailyData.sort((a, b) => a.day - b.day);
      
      // Prepare data for regression
      const regressionData = dailyData.map((d, i) => [i, d.amount]);
      
      // Run linear regression if we have enough data points
      if (regressionData.length > 3) {
        const result = regression.linear(regressionData);
        
        // Generate prediction for next 7 days
        const lastDay = dailyData[dailyData.length - 1].day;
        const predictedPoints = [];
        
        for (let i = 1; i <= 7; i++) {
          const predictedDay = lastDay + i;
          const dateOfPrediction = new Date(predictedDay * 24 * 60 * 60 * 1000);
          const predictedValue = Math.max(0, result.predict(regressionData.length - 1 + i)[1]);
          
          predictedPoints.push({
            day: predictedDay,
            date: dateOfPrediction.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            amount: 0, // No actual spending yet
            predicted: Math.round(predictedValue)
          });
        }
        
        // Combine actual and predicted data
        const combinedData = [
          ...dailyData.slice(-14).map(d => ({ ...d, predicted: null })), // Last 14 days of actual data
          ...predictedPoints // Next 7 days of predictions
        ];
        
        return {
          dailyData: combinedData,
          slope: result.equation[0],
          trend: result.equation[0] > 0 ? 'increasing' : 'decreasing',
          confidence: result.r2,
          // Calculate expected monthly spending based on trend
          expectedMonthlySpending: Math.round(
            monthlyInsights.totalExpense * (1 + result.equation[0] * 0.5)
          )
        };
      }
      
      return {
        dailyData: dailyData.slice(-14),
        slope: 0,
        trend: 'stable',
        confidence: 0,
        expectedMonthlySpending: monthlyInsights.totalExpense
      };
    };
    
    // Calculate spending difference
    const spendingDifference = {
      amount: monthlyInsights.totalExpense - prevMonthInsights.totalExpense,
      percentage: prevMonthInsights.totalExpense > 0 
        ? (monthlyInsights.totalExpense - prevMonthInsights.totalExpense) / prevMonthInsights.totalExpense * 100
        : 0
    };
    
    // Smart suggestions based on spending patterns
    const generateSuggestions = () => {
      const suggestions = [];
      
      // Check if any category exceeds 50% of total expenses
      const dominantCategory = monthlyInsights.topCategories[0];
      if (dominantCategory && (dominantCategory.value / monthlyInsights.totalExpense) > 0.5) {
        suggestions.push({
          type: 'warning',
          category: dominantCategory.name,
          message: `${dominantCategory.name} accounts for over 50% of your expenses. Consider diversifying your spending.`,
          impact: formatINR(dominantCategory.value * 0.2) + ' potential savings',
          icon: <FiAlertCircle className="text-yellow-500" />
        });
      }
      
      // Suggestion based on transaction frequency in top category
      if (monthlyInsights.topCategories.length > 0) {
        const topCategory = monthlyInsights.topCategories[0];
        const avgTransactionInTopCategory = topCategory.value / 
          monthlyTransactions.filter(t => 
            String(t.senderId?.$oid || t.senderId) === userId && 
            t.note?.toLowerCase().includes(topCategory.name.toLowerCase())
          ).length;
        
        suggestions.push({
          type: 'tip',
          category: topCategory.name,
          message: `Reducing ${topCategory.name} expenses by just one transaction per week could save you ${formatINR(avgTransactionInTopCategory * 4)} monthly.`,
          impact: 'Medium-term saving',
          icon: <FiTarget className="text-blue-500" />
        });
      }
      
      // Suggestion based on spending trend
      const prediction = generatePredictionData();
      if (prediction.trend === 'increasing' && prediction.confidence > 0.5) {
        suggestions.push({
          type: 'alert',
          category: 'Spending Trend',
          message: `Your spending is trending upward. If this continues, you might spend ${formatINR(prediction.expectedMonthlySpending)} next month.`,
          impact: 'High impact on savings',
          icon: <FiTrendingUp className="text-red-500" />
        });
      } else if (prediction.trend === 'decreasing' && prediction.confidence > 0.5) {
        suggestions.push({
          type: 'achievement',
          category: 'Spending Trend',
          message: `Great job! Your spending is trending downward. Keep it up to increase your savings.`,
          impact: 'Positive impact on savings',
          icon: <FiTrendingDown className="text-green-500" />
        });
      }
      
      // Suggestion for savings goal
      if (monthlyInsights.savedAmount > 0) {
        const savingsGoal = Math.round(monthlyInsights.savedAmount * 1.1);
        suggestions.push({
          type: 'goal',
          category: 'Savings Challenge',
          message: `You saved ${formatINR(monthlyInsights.savedAmount)} this month. Challenge yourself to save ${formatINR(savingsGoal)} next month!`,
          impact: 'Building wealth',
          icon: <FiTarget className="text-purple-500" />
        });
      }
      
      // Badge for no-spend days
      if (monthlyInsights.noSpendDays >= 5) {
        suggestions.push({
          type: 'badge',
          category: 'Achievement',
          message: `You've earned the "Smart Saver" badge with ${monthlyInsights.noSpendDays} no-spend days this month!`,
          impact: 'Financial discipline',
          icon: <FiAward className="text-amber-500" />
        });
      }
      
      return suggestions;
    };
    
    return {
      weeklyInsights,
      monthlyInsights,
      prevMonthInsights,
      spendingDifference,
      predictions: generatePredictionData(),
      suggestions: generateSuggestions()
    };
  }, [transactionData, timeRange]);
  
  // Loading state
  if (isTransactionLoading || !processedData) {
    return (
      <DashboardLayout>
        <div className="w-full h-full p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Loading financial insights...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Access the correct insights based on selected time range
  const currentInsights = timeRange === 'week' 
    ? processedData.weeklyInsights 
    : processedData.monthlyInsights;
  
  // Time period text
  const timePeriodText = timeRange === 'week' ? 'this week' : 'this month';
  
  return (
    <DashboardLayout>
      <div className="w-full h-[calc(100vh-64px)] overflow-auto p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Financial Insights & Predictions</h1>
              <p className="mt-1 text-gray-500">Smart analysis and forecasting based on your transaction patterns</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-sm p-1">
                <button 
                  onClick={() => setTimeRange('week')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === 'week' 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setTimeRange('month')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === 'month' 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Monthly
                </button>
              </div>
              
              <button 
                onClick={() => setShowPredictions(!showPredictions)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {showPredictions ? 'Hide' : 'Show'} Predictions
              </button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">Total Earnings</h3>
                <span className="text-green-500 bg-green-50 px-2 py-1 rounded-md text-sm font-medium">
                  Income
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatINR(currentInsights.totalIncome)}
              </p>
              <p className="text-sm text-gray-500">
                {currentInsights.totalIncome > 0 
                  ? `You've received money from ${processedData.weeklyInsights.daysCount} sources ${timePeriodText}`
                  : `No income recorded ${timePeriodText}`
                }
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">Total Spending</h3>
                <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">
                  Expenses
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatINR(currentInsights.totalExpense)}
              </p>
              <p className="text-sm text-gray-500">
                {timeRange === 'month' && processedData.spendingDifference.amount !== 0 ? (
                  <span className={processedData.spendingDifference.amount > 0 ? 'text-red-500' : 'text-green-500'}>
                    {processedData.spendingDifference.amount > 0 ? '↑' : '↓'} {formatINR(Math.abs(processedData.spendingDifference.amount))} from last month
                  </span>
                ) : (
                  `Average daily: ${formatINR(currentInsights.avgDailySpending)}`
                )}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">Savings</h3>
                <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-md text-sm font-medium">
                  Balance
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatINR(currentInsights.savedAmount)}
              </p>
              <p className="text-sm text-gray-500">
                {currentInsights.savedAmount > 0 
                  ? `You saved ${Math.round((currentInsights.savedAmount / currentInsights.totalIncome) * 100)}% of your income ${timePeriodText}`
                  : `You've spent more than you earned ${timePeriodText}`
                }
              </p>
            </motion.div>
          </div>
          
          {/* Charts & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Spending Pattern */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending Pattern & Predictions</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={processedData.predictions.dailyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [formatINR(value), '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6366F1" 
                      fill="url(#colorSpending)" 
                      strokeWidth={2}
                      name="Actual Spending"
                    />
                    {showPredictions && (
                      <Area 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#F59E0B" 
                        fill="url(#colorPrediction)" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        name="Predicted Spending"
                      />
                    )}
                    <defs>
                      <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Trend:</span> Your spending is {processedData.predictions.trend}
                  {timeRange === 'month' && (
                    processedData.predictions.trend === 'increasing' 
                      ? `. At this rate, you might spend ${formatINR(processedData.predictions.expectedMonthlySpending)} next month.`
                      : `. If this continues, you might spend ${formatINR(processedData.predictions.expectedMonthlySpending)} next month.`
                  )}
                </p>
              </div>
            </motion.div>
            
            {/* Top Spending Categories */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Spending Categories</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentInsights.topCategories.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentInsights.topCategories.slice(0, 5).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[
                            '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                            '#EC4899', '#14B8A6', '#F97316'
                          ][index % 8]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatINR(value), '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {currentInsights.topCategories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">{category.name}</span>
                    <span className="text-gray-500">{formatINR(category.value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Insights and Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Smart Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Insights</h3>
              <div className="space-y-4">
                {/* Highest Spending Day */}
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <FiTrendingUp className="text-indigo-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Highest Spending Day</h4>
                    <p className="text-sm text-gray-500">
                      {currentInsights.highestSpendingDay.day !== 'None' 
                        ? `You spent the most on ${currentInsights.highestSpendingDay.day} (${formatINR(currentInsights.highestSpendingDay.amount)})`
                        : `No spending recorded ${timePeriodText}`
                      }
                    </p>
                  </div>
                </div>
                
                {/* Average Daily Spending */}
                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-3">
                    <FiTrendingDown className="text-emerald-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Average Daily Spending</h4>
                    <p className="text-sm text-gray-500">
                      Your average daily spending is {formatINR(currentInsights.avgDailySpending)}.
                      {currentInsights.noSpendDays > 0 && 
                        ` You had ${currentInsights.noSpendDays} no-spend ${currentInsights.noSpendDays === 1 ? 'day' : 'days'} ${timePeriodText}.`
                      }
                    </p>
                  </div>
                </div>
                
                {/* Spending Comparison */}
                {timeRange === 'month' && (
                  <div className="flex items-start">
                    <div className={`${
                      processedData.spendingDifference.amount > 0 
                        ? 'bg-red-100' 
                        : 'bg-green-100'
                    } rounded-full p-2 mr-3`}>
                      {processedData.spendingDifference.amount > 0 
                        ? <FiTrendingUp className="text-red-600 text-lg" />
                        : <FiTrendingDown className="text-green-600 text-lg" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Month-over-Month Comparison</h4>
                      <p className="text-sm text-gray-500">
                        {processedData.spendingDifference.amount === 0 
                          ? "Your spending is the same as last month."
                          : processedData.spendingDifference.amount > 0 
                            ? `You spent ${formatINR(processedData.spendingDifference.amount)} more than last month (${Math.abs(processedData.spendingDifference.percentage).toFixed(1)}% increase).`
                            : `You spent ${formatINR(Math.abs(processedData.spendingDifference.amount))} less than last month (${Math.abs(processedData.spendingDifference.percentage).toFixed(1)}% decrease).`
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Savings Achievement */}
                {currentInsights.savedAmount > 0 && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <FiAward className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Savings Achievement</h4>
                      <p className="text-sm text-gray-500">
                        You saved {formatINR(currentInsights.savedAmount)} {timePeriodText} — that's {Math.round((currentInsights.savedAmount / currentInsights.totalIncome) * 100)}% of your income!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Smart Suggestions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Suggestions</h3>
              {processedData.suggestions.length > 0 ? (
                <div className="space-y-4">
                  {processedData.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-0.5 mr-3">
                        {suggestion.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">
                          {suggestion.category}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">
                          {suggestion.message}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${ 
                          suggestion.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          suggestion.type === 'alert' ? 'bg-red-100 text-red-700' :
                          suggestion.type === 'achievement' ? 'bg-emerald-100 text-emerald-700' :
                          suggestion.type === 'badge' ? 'bg-amber-100 text-amber-700' :
                          suggestion.type === 'goal' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Next Step Prompt */}
                  <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-700 mb-1">Want to take control?</h4>
                    <p className="text-sm text-indigo-600 mb-3">
                      Set a budget for next {timeRange} to optimize your savings.
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Set Budget Goals
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <FiAlertCircle className="text-4xl mb-2" />
                  <p>Not enough data to generate suggestions</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
