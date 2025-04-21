import React, { useState, useEffect, useMemo, useContext } from "react";
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
import { TranslationContext2 } from "../../context/TranslationContext2";
import AiFinanceAdvisor from "./AiFinanceAdvisor";

const Predictions = () => {
  const [timeRange, setTimeRange] = useState("month"); // week, month, year
  const [showPredictions, setShowPredictions] = useState(true);
  const { data: transactionData, isLoading: isTransactionLoading, error } = useGetDetailedTransactionsQuery();
  const { data: userProfile } = useGetUserProfileQuery();
  
  // Get translations
  const translationContext = useContext(TranslationContext2);
  const { translations } = translationContext || { 
    translations: { 
      predictions: {
        title: "Financial Insights & Predictions",
        subtitle: "Smart analysis and forecasting based on your transaction patterns",
        loading: "Loading financial insights...",
        weekly: "Weekly",
        monthly: "Monthly",
        hide: "Hide",
        show: "Show",
        predictions: "Predictions",
        earnings: "Earnings",
        income: "Income",
        spending: "Spending",
        expenses: "Expenses",
        savings: "Savings",
        balance: "Balance",
        spendingPattern: "Spending Pattern",
        topSpendingCategories: "Top Spending Categories",
        financialInsights: "Financial Insights",
        smartSuggestions: "Smart Suggestions",
        highestSpendingDay: "Highest Spending Day",
        avgDailySpending: "Average Daily Spending",
        monthComparison: "Month to Month",
        savingsAchievement: "Savings Achievement",
        noSpendDay: "no-spend day",
        noSpendDays: "no-spend days",
        takeControl: "Take Control of Your Finances",
        setBudget: "Set a budget for this",
        optimizeSavings: "to optimize your savings",
        setBudgetGoals: "Set Budget Goals",
        noDataSuggestions: "Not enough data to provide suggestions yet",
        fromSources: "from",
        sources: "sources",
        noIncomeRecorded: "No income recorded",
        averageDaily: "Average daily",
        youSaved: "You saved",
        ofYourIncome: "of your income",
        youSpentMoreThanEarned: "You spent more than you earned",
        trend: "Spending Trend:",
        trendText: "Your spending pattern is",
        increasing: "increasing",
        decreasing: "decreasing",
        stable: "stable",
        nextMonth: "next month",
        sameAsLastMonth: "Same as last month",
        spentMore: "You spent",
        spentLess: "You spent",
        lastMonth: "compared to last month",
        increase: "increase",
        decrease: "decrease",
        youSpentMost: "You spent the most on",
        noSpendingRecorded: "No spending recorded",
        youHad: "You had",
        thats: "that's",
        spendingTrend: "Your spending is trending",
        actualSpending: "Actual Spending",
        predictedSpending: "Predicted Spending",
      }
    } 
  };
  
  const { predictions: t } = translations;
  
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
  if (isTransactionLoading) {
    return (
      <DashboardLayout>
        <div className="w-full h-full p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">{t.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full h-full p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-lg text-gray-600">Error loading financial data. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Data empty state
  if (!processedData) {
    return (
      <DashboardLayout>
        <div className="w-full h-full p-8 flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="text-gray-300 text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Financial Data Available</h3>
            <p className="text-gray-600">
              We don't have enough transaction data to generate insights. Please make some transactions first.
            </p>
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
      <div className="w-full h-[calc(100vh-64px)] overflow-auto p-6 md:p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">{t.title}</h1>
              <p className="mt-1 text-emerald-600">{t.subtitle}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-sm p-1">
                <button 
                  onClick={() => setTimeRange('week')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === 'week' 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t.weekly}
                </button>
                <button 
                  onClick={() => setTimeRange('month')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === 'month' 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t.monthly}
                </button>
              </div>
              
              <button 
                onClick={() => setShowPredictions(!showPredictions)}
                className="px-4 py-2 bg-white border border-emerald-200 rounded-lg shadow-sm text-sm font-medium hover:bg-emerald-50 transition-colors text-emerald-700"
              >
                {showPredictions ? t.hide : t.show} {t.predictions}
              </button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">{t.earnings}</h3>
                <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
                  {t.income}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatINR(currentInsights.totalIncome)}
              </p>
              <p className="text-sm text-gray-500">
                {currentInsights.totalIncome > 0 
                  ? `${t.fromSources} ${processedData.weeklyInsights.daysCount} ${t.sources} ${timePeriodText}`
                  : `${t.noIncomeRecorded} ${timePeriodText}`
                }
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">{t.spending}</h3>
                <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm font-medium">
                  {t.expenses}
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
                  `${t.averageDaily}: ${formatINR(currentInsights.avgDailySpending)}`
                )}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">{t.savings}</h3>
                <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-sm font-medium">
                  {t.balance}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatINR(currentInsights.savedAmount)}
              </p>
              <p className="text-sm text-gray-500">
                {currentInsights.savedAmount > 0 
                  ? `${t.youSaved} ${Math.round((currentInsights.savedAmount / currentInsights.totalIncome) * 100)}% ${t.ofYourIncome} ${timePeriodText}`
                  : `${t.youSpentMoreThanEarned} ${timePeriodText}`
                }
              </p>
            </motion.div>
          </div>
          
          {/* Restructured Layout: Main Content + AI Advisor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column: Charts & Main Stats (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Spending Pattern */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
              >
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">{t.spendingPattern}</h3>
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
                        stroke="#10B981" 
                        fill="url(#colorSpending)" 
                        strokeWidth={2}
                        name={t.actualSpending}
                      />
                      {showPredictions && (
                        <Area 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#F59E0B" 
                          fill="url(#colorPrediction)" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          name={t.predictedSpending}
                        />
                      )}
                      <defs>
                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                    <span className="font-medium">{t.trend}</span> {t.trendText} {
                      processedData.predictions.trend === 'increasing' ? t.increasing : 
                      processedData.predictions.trend === 'decreasing' ? t.decreasing : 
                      t.stable
                    }
                    {timeRange === 'month' && (
                      processedData.predictions.trend === 'increasing' 
                        ? `. At this rate, you might spend ${formatINR(processedData.predictions.expectedMonthlySpending)} ${t.nextMonth}.`
                        : `. If this continues, you might spend ${formatINR(processedData.predictions.expectedMonthlySpending)} ${t.nextMonth}.`
                    )}
                  </p>
                </div>
              </motion.div>
              
              {/* Insights and Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Insights */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
                >
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4">{t.financialInsights}</h3>
                  <div className="space-y-4">
                    {/* Highest Spending Day */}
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3">
                        <FiTrendingUp className="text-emerald-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">{t.highestSpendingDay}</h4>
                        <p className="text-sm text-gray-500">
                          {currentInsights.highestSpendingDay.day !== 'None' 
                            ? `${t.youSpentMost} ${currentInsights.highestSpendingDay.day} (${formatINR(currentInsights.highestSpendingDay.amount)})`
                            : `${t.noSpendingRecorded} ${timePeriodText}`
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
                        <h4 className="font-medium text-gray-700">{t.avgDailySpending}</h4>
                        <p className="text-sm text-gray-500">
                          {t.averageDaily} {formatINR(currentInsights.avgDailySpending)}.
                          {currentInsights.noSpendDays > 0 && 
                            ` ${t.youHad} ${currentInsights.noSpendDays} ${currentInsights.noSpendDays === 1 ? t.noSpendDay : t.noSpendDays} ${timePeriodText}.`
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
                          <h4 className="font-medium text-gray-700">{t.monthComparison}</h4>
                          <p className="text-sm text-gray-500">
                            {processedData.spendingDifference.amount === 0 
                              ? t.sameAsLastMonth
                              : processedData.spendingDifference.amount > 0 
                                ? `${t.spentMore} ${formatINR(processedData.spendingDifference.amount)} ${t.lastMonth} (${Math.abs(processedData.spendingDifference.percentage).toFixed(1)}% ${t.increase}).`
                                : `${t.spentLess} ${formatINR(Math.abs(processedData.spendingDifference.amount))} ${t.lastMonth} (${Math.abs(processedData.spendingDifference.percentage).toFixed(1)}% ${t.decrease}).`
                            }
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Savings Achievement */}
                    {currentInsights.savedAmount > 0 && (
                      <div className="flex items-start">
                        <div className="bg-emerald-100 rounded-full p-2 mr-3">
                          <FiAward className="text-emerald-600 text-lg" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">{t.savingsAchievement}</h4>
                          <p className="text-sm text-gray-500">
                            {t.youSaved} {formatINR(currentInsights.savedAmount)} {timePeriodText} — {t.thats} {Math.round((currentInsights.savedAmount / currentInsights.totalIncome) * 100)}% {t.ofYourIncome}!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Top Spending Categories */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
                >
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4">{t.topSpendingCategories}</h3>
                  <div className="h-52">
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
                                '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5',
                                '#059669', '#047857', '#065F46', '#064E3B'
                              ][index % 9]} 
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
              
              {/* Smart Suggestions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100"
              >
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">{t.smartSuggestions}</h3>
                {processedData.suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processedData.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
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
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <FiAlertCircle className="text-4xl mb-2" />
                    <p>{t.noDataSuggestions}</p>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Right Column: AI Advisor (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Finance Advisor Component */}
              <AiFinanceAdvisor financialData={processedData} timeRange={timeRange} />
              
              {/* Next Step Prompt */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-md p-6 text-white"
              >
                <h3 className="text-lg font-semibold mb-2">{t.takeControl}</h3>
                <p className="text-sm opacity-90 mb-4">
                  {t.setBudget} {timeRange} {t.optimizeSavings}
                </p>
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  {t.setBudgetGoals}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
