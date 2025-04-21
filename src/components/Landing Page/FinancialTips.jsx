import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiAlertCircle, FiCreditCard, FiPieChart, FiBarChart2, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TranslationContext2 } from "../../context/TranslationContext2";

const FinancialTips = () => {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(0);
  
  // Get translations
  const translationContext = useContext(TranslationContext2);
  const { translations } = translationContext || { 
    translations: { 
      financialTips: {
        title: "Financial Insights",
        subtitle: "Tips to improve your finances",
        // Fallback translations if needed...
        tips: [
          {
            title: "Save for emergencies",
            description: "Aim to save at least 3-6 months of expenses in an emergency fund."
          },
          // ...other tips
        ],
        quickActions: "Quick Actions",
        createSavingsGoal: "Create Savings Goal",
        exploreInvestments: "Explore Investments",
        financeScore: "Personal Finance Score",
        good: "Good",
        financeHealth: "Your finance health is good, but there's room for improvement.",
        viewDetailedReport: "View Detailed Report"
      }
    } 
  };
  
  const { financialTips: t } = translations;
  
  const tipIcons = [
    <FiAlertCircle className="h-5 w-5" />,
    <FiPieChart className="h-5 w-5" />,
    <FiCreditCard className="h-5 w-5" />,
    <FiBarChart2 className="h-5 w-5" />,
    <FiShield className="h-5 w-5" />
  ];
  
  const tipColors = [
    "bg-amber-100 text-amber-600",
    "bg-blue-100 text-blue-600",
    "bg-red-100 text-red-600",
    "bg-purple-100 text-purple-600",
    "bg-emerald-100 text-emerald-600"
  ];
  
  const tips = t.tips.map((tip, index) => ({
    ...tip,
    icon: tipIcons[index] || tipIcons[0],
    color: tipColors[index] || tipColors[0]
  }));
  
  const handlePrevTip = () => {
    setCurrentTip((prev) => (prev === 0 ? tips.length - 1 : prev - 1));
  };
  
  const handleNextTip = () => {
    setCurrentTip((prev) => (prev === tips.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">{t.title}</h2>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="p-2 bg-emerald-100 rounded-lg">
          <FiTrendingUp className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
        <div className="flex justify-between mb-4">
          <div className={`p-2 rounded-full ${tips[currentTip].color}`}>
            {tips[currentTip].icon}
          </div>
          <div className="flex">
            <button 
              className="p-1 text-gray-400 hover:text-gray-600"
              onClick={handlePrevTip}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-gray-600"
              onClick={handleNextTip}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">{tips[currentTip].title}</h3>
        <p className="text-gray-600">{tips[currentTip].description}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">{t.quickActions}</h3>
        <div className="space-y-2">
          <button 
            className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors flex items-center"
            onClick={() => navigate('/savings')}
          >
            <FiBarChart2 className="mr-3" /> {t.createSavingsGoal}
          </button>
          <button 
            className="w-full text-left px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors flex items-center"
            onClick={() => navigate('/markets')}
          >
            <FiPieChart className="mr-3" /> {t.exploreInvestments}
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
        <h3 className="font-bold mb-2">{t.financeScore}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold">78/100</span>
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{t.good}</span>
        </div>
        <div className="w-full bg-white/30 h-2 rounded-full mb-3">
          <div className="bg-white h-full rounded-full" style={{ width: "78%" }}></div>
        </div>
        <p className="text-sm opacity-90">{t.financeHealth}</p>
        <button className="w-full mt-3 bg-white text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
          {t.viewDetailedReport}
        </button>
      </div>
    </motion.div>
  );
};

export default FinancialTips;
