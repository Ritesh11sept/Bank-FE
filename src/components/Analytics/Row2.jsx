import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BoxHeader from "./BoxHeader";
import { useGetUserTransactionsQuery } from "../../state/api";
import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const Row2 = ({ data }) => {
  const [processedData, setProcessedData] = useState(null);
  const { data: userTransactions, isLoading } = useGetUserTransactionsQuery();
  const userId = localStorage.getItem('userId');

  // Process transactions to get financial data
  useEffect(() => {
    if (userTransactions) {
      // Check the structure of userTransactions and extract the transactions array
      const transactions = Array.isArray(userTransactions) 
        ? userTransactions 
        : userTransactions.transactions || [];
      
      console.log('Processing transactions for Row2:', transactions);
      
      if (Array.isArray(transactions)) {
        processTransactions(transactions);
      } else {
        console.error('Transactions is not an array:', transactions);
        // Create an empty data structure with defaults
        setProcessedData({
          transactions: [],
          incomeByMonth: {},
          expensesByMonth: {},
          categoriesByAmount: {},
          totalIncome: 0,
          totalExpenses: 0,
          recentTransactions: [],
          incomeByMonthArray: [],
          expensesByMonthArray: [],
          categoriesArray: [],
        });
      }
    }
  }, [userTransactions]);

  const processTransactions = (transactions) => {
    const processedData = {
      transactions: transactions,
      incomeByMonth: {},
      expensesByMonth: {},
      categoriesByAmount: {},
      totalIncome: 0,
      totalExpenses: 0,
      recentTransactions: [],
      incomeByMonthArray: [],
      expensesByMonthArray: [],
      categoriesArray: [],
    };

    transactions.forEach(transaction => {
      try {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;
        
        const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
        const senderId = String(transaction.senderId?.$oid || transaction.senderId);
        
        const isIncome = receiverId === userId;
        const isExpense = senderId === userId;
        
        const amount = transaction.amount;
        
        let category = 'other';
        if (transaction.note && typeof transaction.note === 'string') {
          category = transaction.note.toLowerCase().trim();
          if (category.includes(' ')) {
            category = category.split(' ')[0];
          }
        }
        
        if (isIncome) {
          processedData.totalIncome += amount;
          processedData.incomeByMonth[monthYear] = (processedData.incomeByMonth[monthYear] || 0) + amount;
        }
        
        if (isExpense) {
          processedData.totalExpenses += amount;
          processedData.expensesByMonth[monthYear] = (processedData.expensesByMonth[monthYear] || 0) + amount;
          
          if (!processedData.categoriesByAmount[category]) {
            processedData.categoriesByAmount[category] = 0;
          }
          processedData.categoriesByAmount[category] += amount;
        }
      } catch (err) {
        console.error('Error processing transaction:', err, transaction);
      }
    });
    
    processedData.incomeByMonthArray = Object.entries(processedData.incomeByMonth)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
      });
      
    processedData.expensesByMonthArray = Object.entries(processedData.expensesByMonth)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
      });
      
    processedData.categoriesArray = Object.entries(processedData.categoriesByAmount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    processedData.recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    setProcessedData(processedData);
  };

  if (isLoading || (!processedData && !data)) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-lg p-4" style={{ gridArea: "b" }}>
          <div className="animate-pulse h-full w-full bg-gray-200 rounded"></div>
        </div>
      </>
    );
  }

  const displayData = processedData || data;
  if (!displayData) return null;

  const balanceData = displayData.incomeByMonthArray?.map((item, index) => {
    const expenseItem = displayData.expensesByMonthArray[index] || { name: item.name, value: 0 };
    return {
      name: item.name,
      balance: item.value - expenseItem.value
    };
  }) || [];

  const recentTransactions = displayData.recentTransactions?.map(transaction => {
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    
    const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
    const senderId = String(transaction.senderId?.$oid || transaction.senderId);
    
    const isIncome = receiverId === userId;
    
    return {
      ...transaction,
      formattedDate,
      type: isIncome ? 'income' : 'expense',
      displayAmount: isIncome ? `+₹${transaction.amount.toLocaleString()}` : `-₹${transaction.amount.toLocaleString()}`,
      otherParty: isIncome ? transaction.senderName : transaction.receiverName
    };
  }) || [];

  const categoryRadarData = displayData.categoriesArray?.slice(0, 6).map(item => ({
    category: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    amount: item.value
  })) || [];

  const monthlyExpenses = displayData.expensesByMonthArray?.slice(-6) || [];
  
  console.log('Monthly expenses data for chart:', monthlyExpenses);
  
  if (monthlyExpenses.length === 0) {
    console.log('No expense data found, creating placeholder data');
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      monthlyExpenses.push({
        name: `${monthName} ${year}`,
        value: 0,
        isPlaceholder: true
      });
    }
  }

  const maxExpense = Math.max(...monthlyExpenses.map(item => item.value), 1000);

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const scatterData = displayData.transactions?.map(transaction => {
    const date = new Date(transaction.date);
    
    const senderId = String(transaction.senderId?.$oid || transaction.senderId);
    
    const isExpense = senderId === userId;
    
    if (!isExpense) return null;
    
    let category = 'other';
    if (transaction.note && typeof transaction.note === 'string') {
      category = transaction.note.toLowerCase().trim();
      if (category.includes(' ')) {
        category = category.split(' ')[0];
      }
    }
    
    return {
      x: date.getDate(),
      y: transaction.amount,
      z: Math.min(transaction.amount / 20, 30),
      category: category,
      name: transaction.note || 'Other',
      date: date.toLocaleDateString(),
      recipient: transaction.receiverName
    };
  }).filter(Boolean) || [];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "b" }}
      >
        <BoxHeader
          title="Recent Transactions"
          subtitle="Your last 5 transactions"
          sideText="View All"
        />
        <div className="flex-1 overflow-y-auto pr-1">
          {recentTransactions.map((transaction, index) => (
            <motion.div 
              key={transaction._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-center py-3 border-b border-gray-100"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-lg ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '↓' : '↑'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{transaction.otherParty}</p>
                  <p className="text-xs text-gray-500">
                    {transaction.note ? transaction.note : 'No description'} • {transaction.formattedDate}
                  </p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.displayAmount}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "d" }}
      >
        <BoxHeader
          title="Category Analysis"
          subtitle="Spending across categories"
        />
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryRadarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#4b5563', fontSize: 12 }} />
              <Radar
                name="Spending"
                dataKey="amount"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.6}
                animationDuration={1500}
              />
              <Tooltip 
                formatter={(value) => formatINR(value)}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "f" }}
      >
        <BoxHeader
          title="Monthly Expenses"
          subtitle={monthlyExpenses.some(e => e.value > 0) ? 
            "Bar chart showing money sent each month" : 
            "No expense data available yet"}
          sideText={formatINR(displayData.totalExpenses)}
        />
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyExpenses}
              margin={{
                top: 15,
                right: 25,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="barExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#FECACA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                domain={[0, maxExpense * 1.1]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatINR(value), "Money Sent"]}
              />
              <Bar
                name="Money Sent"
                dataKey="value"
                fill="url(#barExpenses)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                label={
                  monthlyExpenses.length > 0 && !monthlyExpenses.every(e => e.value === 0) ? 
                  {
                    position: 'top',
                    content: (props) => {
                      const { value } = props;
                      return value > 0 ? `₹${value.toLocaleString()}` : '';
                    },
                    fill: '#666',
                    fontSize: 10,
                  } : null
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "g" }}
      >
        <BoxHeader
          title="Spending Patterns"
          subtitle="Daily expense distribution"
        />
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Day of Month" 
                domain={[1, 31]}
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Amount"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <ZAxis type="number" range={[60, 400]} dataKey="z" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value, name) => {
                  if (name === 'y') return formatINR(value);
                  if (name === 'x') return `Day: ${value}`;
                  return value;
                }}
              />
              <Scatter 
                name="Expenses" 
                data={scatterData} 
                fill="#8884d8"
                animationDuration={1500}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
};

export default Row2;
