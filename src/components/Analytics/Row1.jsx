import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import BoxHeader from "./BoxHeader";
import { TranslationContext2 } from "../../context/TranslationContext2";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Cell,
  Legend,
} from "recharts";
import { useGetUserTransactionsQuery } from "../../state/api";

const Row1 = ({ data }) => {
  const [processedData, setProcessedData] = useState(null);
  const { data: userTransactions, isLoading } = useGetUserTransactionsQuery();
  const userId = localStorage.getItem('userId');
  
  // Get translations
  const { translations, language } = useContext(TranslationContext2) || { translations: {}, language: 'english' };
  const t = translations.analytics?.[language] || translations.analytics?.english || {};

  // Process transactions to get financial data
  useEffect(() => {
    if (userTransactions) {
      const transactions = Array.isArray(userTransactions) 
        ? userTransactions 
        : userTransactions.transactions || [];
      
      if (Array.isArray(transactions)) {
        processTransactions(transactions);
      } else {
        setProcessedData({
          transactions: [],
          incomeByMonth: {},
          expensesByMonth: {},
          categoriesByAmount: {},
          totalIncome: 0,
          totalExpenses: 0,
          incomeByMonthArray: [],
          expensesByMonthArray: [],
          categoriesArray: [],
        });
      }
    }
  }, [userTransactions]);

  const processTransactions = (transactions) => {
    const incomeByMonth = {};
    const expensesByMonth = {};
    const categoriesByAmount = {};
    let totalIncome = 0;
    let totalExpenses = 0;

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
          totalIncome += amount;
          incomeByMonth[monthYear] = (incomeByMonth[monthYear] || 0) + amount;
        }

        if (isExpense) {
          totalExpenses += amount;
          expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + amount;

          if (!categoriesByAmount[category]) {
            categoriesByAmount[category] = 0;
          }
          categoriesByAmount[category] += amount;
        }
      } catch (err) {
        console.error('Error processing transaction:', err, transaction);
      }
    });

    const incomeByMonthArray = Object.entries(incomeByMonth)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
      });
      
    const expensesByMonthArray = Object.entries(expensesByMonth)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
      });
      
    const categoriesArray = Object.entries(categoriesByAmount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    const finalData = {
      transactions,
      incomeByMonth,
      expensesByMonth,
      categoriesByAmount,
      totalIncome,
      totalExpenses,
      incomeByMonthArray,
      expensesByMonthArray,
      categoriesArray,
    };
    
    setProcessedData(finalData);
  };

  if (isLoading || (!processedData && !data)) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" style={{ gridArea: "a" }}>
          <BoxHeader title={t.loadingData} />
          <div className="flex-1 items-center justify-center flex">
            <div className="animate-pulse w-full h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  const displayData = processedData || data;
  if (!displayData) return null;

  const monthlyComparisonData = [];
  
  const months = new Set([
    ...Object.keys(displayData.incomeByMonth || {}),
    ...Object.keys(displayData.expensesByMonth || {})
  ]);
  
  const sortedMonths = Array.from(months).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateA - dateB;
  });

  if (sortedMonths.length < 6) {
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const monthYear = `${monthName} ${year}`;
      
      if (!sortedMonths.includes(monthYear)) {
        sortedMonths.push(monthYear);
      }
    }
    
    sortedMonths.sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });
  }
  
  sortedMonths.forEach(month => {
    const income = (displayData.incomeByMonth || {})[month] || 0;
    const expenses = (displayData.expensesByMonth || {})[month] || 0;
    
    monthlyComparisonData.push({
      name: month,
      Income: income,
      Expenses: expenses,
      Balance: income - expenses
    });
  });

  const recentMonthlyData = monthlyComparisonData.slice(-6);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A267AC', '#6C5B7B', '#3498DB', '#1ABC9C'];
  const categoryData = displayData.categoriesArray || [];
  
  const formattedCategoryData = categoryData.map(category => ({
    ...category,
    name: category.name.charAt(0).toUpperCase() + category.name.slice(1)
  }));

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "a" }}
      >
        <BoxHeader
          title={t.monthlyIncomeVsExpenses}
          subtitle={`${t.income}: ${formatINR(displayData.totalIncome)} | ${t.expenses}: ${formatINR(displayData.totalExpenses)}`}
          sideText={formatINR(displayData.totalIncome - displayData.totalExpenses)}
        />
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={recentMonthlyData}
              margin={{
                top: 15,
                right: 25,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatINR(value), ""]}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: "10px",
                  fontSize: "12px"
                }}
                formatter={(value) => {
                  if (value === "Income") return t.moneyReceived;
                  if (value === "Expenses") return t.moneySent;
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="Income"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorIncome)"
                activeDot={{ r: 8 }}
                animationDuration={1500}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#F87171"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                activeDot={{ r: 8 }}
                animationDuration={1500}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "c" }}
      >
        <BoxHeader
          title={t.expenseCategories}
          subtitle={t.distributionOfExpenses}
          sideText={formatINR(displayData.totalExpenses)}
        />
        <div className="flex-1 w-full min-h-0 flex flex-row justify-between items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedCategoryData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {formattedCategoryData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 h-full overflow-y-auto pr-2">
            <p className="text-lg font-semibold mb-3">{t.topCategories}</p>
            {formattedCategoryData.slice(0, 6).map((category, index) => (
              <div key={index} className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {formatINR(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full" 
        style={{ gridArea: "e" }}
      >
        <BoxHeader
          title={t.monthlyIncome}
          subtitle={t.monthlyIncomeVisualization}
          sideText={formatINR(displayData.totalIncome)}
        />
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentMonthlyData}
              margin={{
                top: 15,
                right: 25,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.8} />
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
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatINR(value), t.income]}
              />
              <Bar
                dataKey="Income"
                fill="url(#barIncome)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
};

export default Row1;
