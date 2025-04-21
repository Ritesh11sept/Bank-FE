import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiSend, FiCpu, FiRefreshCw, FiAlertCircle, FiBriefcase, FiX, FiShare2, FiDownload } from 'react-icons/fi';
import { TranslationContext2 } from '../../context/TranslationContext2';

const AiFinanceAdvisor = ({ financialData, timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Get translations with language support
  const translationContext = useContext(TranslationContext2);
  const { translations, language } = translationContext || { 
    translations: {}, 
    language: 'english' 
  };
  
  // AI advisor translations with Hindi support
  const defaultTranslations = {
    english: {
      title: "AI Financial Advisor",
      subtitle: "Get personalized financial advice powered by AI",
      loading: "Analyzing your financial data...",
      placeholder: "Ask about your spending habits or how to save more...",
      sendButton: "Ask AI",
      regenerate: "Regenerate advice",
      defaultPrompt: "Analyze my spending and give me 3 personalized tips to improve my finances",
      examples: "Examples",
      example1: "How can I reduce my expenses?",
      example2: "Am I saving enough money?",
      example3: "What category should I spend less on?",
      error: "Sorry, there was an error. Please try again.",
      noData: "We need more transaction data to provide personalized advice.",
      financialAnalysis: "Financial Analysis",
      basedOn: "Based on",
      weekly: "weekly",
      monthly: "monthly",
      transactionData: "transaction data",
      save: "Save",
      close: "Close",
      recentQuestions: "Recent Questions",
      askAdvisor: "Ask your AI financial advisor"
    },
    hindi: {
      title: "AI वित्तीय सलाहकार",
      subtitle: "AI द्वारा संचालित व्यक्तिगत वित्तीय सलाह प्राप्त करें",
      loading: "आपका वित्तीय डेटा विश्लेषण किया जा रहा है...",
      placeholder: "अपनी खर्च आदतों या अधिक बचत के बारे में पूछें...",
      sendButton: "AI से पूछें",
      regenerate: "सलाह पुनः जनरेट करें",
      defaultPrompt: "मेरे खर्च का विश्लेषण करें और मेरे वित्त में सुधार के लिए 3 व्यक्तिगत सुझाव दें",
      examples: "उदाहरण",
      example1: "मैं अपने खर्चों को कैसे कम कर सकता हूं?",
      example2: "क्या मैं पर्याप्त पैसे बचा रहा हूं?",
      example3: "मुझे किस श्रेणी में कम खर्च करना चाहिए?",
      error: "क्षमा करें, एक त्रुटि हुई थी। कृपया पुनः प्रयास करें।",
      noData: "व्यक्तिगत सलाह प्रदान करने के लिए हमें अधिक लेनदेन डेटा की आवश्यकता है।",
      financialAnalysis: "वित्तीय विश्लेषण",
      basedOn: "आधारित",
      weekly: "साप्ताहिक",
      monthly: "मासिक",
      transactionData: "लेनदेन डेटा",
      save: "सहेजें",
      close: "बंद करें",
      recentQuestions: "हाल के प्रश्न",
      askAdvisor: "अपने AI वित्तीय सलाहकार से पूछें"
    }
  };

  // Get the right translations based on language
  const t = (translations.ai && translations.ai[language]) || defaultTranslations[language] || defaultTranslations.english;
  
  // Adjust AI prompt based on language
  const getAIPromptLanguage = () => {
    return language === 'hindi' ? 'hindi' : 'english';
  };
  
  // Format AI response to display more professionally
  const formatAiResponse = (text) => {
    if (!text) return "";
    
    let formatted = text
      .replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold text-emerald-700">$1</span>')
      .replace(/\* ([^\n]+)/g, '<div class="flex items-start my-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></div><div>$1</div></div>')
      .replace(/(\d+)\.\s([^\n]+)/g, '<div class="flex items-start my-2"><div class="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-xs font-medium text-emerald-700">$1</div><div class="mt-0.5">$2</div></div>')
      .replace(/(\n{2,})/g, '<div class="my-3 border-b border-emerald-100"></div>');
    
    return formatted;
  };

  useEffect(() => {
    if (financialData) {
      generateDefaultPrompt();
    }
  }, [financialData, timeRange, language]); // Added language dependency

  const generateDefaultPrompt = () => {
    if (!financialData) return;

    const insights = timeRange === 'week' ? financialData.weeklyInsights : financialData.monthlyInsights;
    let defaultPrompt = t.defaultPrompt;

    if (insights.topCategories && insights.topCategories.length > 0) {
      if (language === 'hindi') {
        defaultPrompt = `मेरी सबसे बड़ी खर्च श्रेणी ${insights.topCategories[0].name} है। 
        मैंने इस ${timeRange === 'week' ? 'सप्ताह' : 'महीने'} में ${insights.totalExpense} INR खर्च किए।
        मेरी आय ${insights.totalIncome} INR थी।
        इस डेटा के आधार पर मुझे 3 व्यक्तिगत वित्तीय सुझाव दें।`;
      } else {
        defaultPrompt = `My top spending category is ${insights.topCategories[0].name}. 
        I spent ${insights.totalExpense} INR this ${timeRange}. 
        My income was ${insights.totalIncome} INR. 
        Give me 3 personalized financial tips based on this data.`;
      }
    }

    setAiPrompt(defaultPrompt);
  };

  const fetchAiInsights = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const geminiApiKey = import.meta.env.VITE_API_KEY;
      
      if (!geminiApiKey) {
        throw new Error("API key is missing");
      }

      const insights = timeRange === 'week' ? financialData.weeklyInsights : financialData.monthlyInsights;
      
      const topCategories = (insights.topCategories || []).slice(0, 3);
      const topCategoriesText = topCategories.length > 0 
        ? topCategories.map(c => `${c.name}: ₹${c.value}`).join(', ')
        : 'No categories recorded';
      
      const userPrompt = prompt || aiPrompt;
      
      // Adjust prompt based on language
      const promptLanguage = getAIPromptLanguage();
      const fullPrompt = `
        As a financial advisor AI, analyze this user's financial data and respond to their question.
        ${promptLanguage === 'hindi' ? 'Please respond in Hindi language.' : 'Respond in English language.'}
        
        Financial Context:
        - Time period: ${timeRange}
        - Total income: ₹${insights.totalIncome || 0}
        - Total expenses: ₹${insights.totalExpense || 0}
        - Savings: ₹${insights.savedAmount || 0}
        - Top spending categories: ${topCategoriesText}
        - Spending trend: ${financialData.predictions?.trend || 'stable'}
        
        User question: "${userPrompt}"
        
        Provide personalized financial advice based on this data. Format your response with clear sections.
        Focus on being specific with actionable steps and concrete amounts in Indian Rupees (₹).
        Be concise, pragmatic and avoid generic advice. Add short motivational elements but remain professional.
        Use bold text for section titles and bullet points for lists of suggestions.
        Never say "As an AI" or include disclaimers.
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                { text: fullPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const newPrompt = {
          prompt: userPrompt,
          response: response.data.candidates[0].content.parts[0].text
        };
        
        setPromptHistory(prev => [newPrompt, ...prev.slice(0, 4)]);
        setAiResponse(response.data.candidates[0].content.parts[0].text);
        setShowPopup(true);
      } else {
        throw new Error("Invalid response format from AI service");
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAdvice = () => {
    if (!aiResponse) return;
    
    // Convert HTML to plain text for download
    const plainText = aiResponse.replace(/<[^>]*>?/gm, '');
    
    const element = document.createElement("a");
    const file = new Blob([plainText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "financial-advice.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const hasFinancialData = financialData && 
                          (financialData.weeklyInsights?.topCategories?.length > 0 || 
                           financialData.monthlyInsights?.topCategories?.length > 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
            <FiCpu className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="mb-4">
          {loading ? (
            <div className="bg-emerald-50 rounded-lg p-4 flex items-center justify-center h-32">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-emerald-600 text-sm">{t.loading}</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 flex items-start">
              <FiAlertCircle className="mt-0.5 mr-2" />
              <p>{error}</p>
            </div>
          ) : (
            !hasFinancialData ? (
              <div className="bg-emerald-50 rounded-lg p-4 flex items-center justify-center h-32">
                <div className="flex flex-col items-center text-center">
                  <FiBriefcase className="text-emerald-400 text-2xl mb-2" />
                  <p className="text-emerald-600 text-sm">{t.noData}</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-4 mb-3 text-center">
                <p className="text-emerald-600 mb-4">{t.askAdvisor}</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <button 
                    onClick={() => {
                      setAiPrompt(t.example1);
                      fetchAiInsights(t.example1);
                    }}
                    className="bg-white border border-emerald-200 rounded-md p-2 hover:bg-emerald-50 text-emerald-700"
                  >
                    {t.example1}
                  </button>
                  <button 
                    onClick={() => {
                      setAiPrompt(t.example2);
                      fetchAiInsights(t.example2);
                    }}
                    className="bg-white border border-emerald-200 rounded-md p-2 hover:bg-emerald-50 text-emerald-700"
                  >
                    {t.example2}
                  </button>
                  <button 
                    onClick={() => {
                      setAiPrompt(t.example3);
                      fetchAiInsights(t.example3);
                    }}
                    className="bg-white border border-emerald-200 rounded-md p-2 hover:bg-emerald-50 text-emerald-700"
                  >
                    {t.example3}
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t.placeholder}
            className="w-full border border-emerald-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={loading}
          />
          <button
            onClick={() => fetchAiInsights()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400"
            disabled={loading || !aiPrompt.trim()}
          >
            <FiSend />
          </button>
        </div>

        {promptHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-emerald-600 mb-2">{t.recentQuestions}</h4>
            <div className="space-y-1">
              {promptHistory.map((item, idx) => (
                <div 
                  key={idx}
                  className="text-xs text-gray-600 hover:text-emerald-600 cursor-pointer truncate"
                  onClick={() => {
                    setAiPrompt(item.prompt);
                    setAiResponse(item.response);
                    setShowPopup(true);
                  }}
                >
                  <FiMessageCircle className="inline mr-1 text-emerald-500" size={10} />
                  {item.prompt}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Modern Popup Modal with Emerald Green color scheme */}
      <AnimatePresence>
        {showPopup && aiResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Background overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 transition-opacity bg-emerald-800 bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />

            {/* Modal container with rounded corners */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3 
              }}
              className="relative z-10 w-full max-w-3xl mx-4 bg-white shadow-xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header with emerald gradient */}
              <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <FiCpu className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">{t.financialAnalysis}</h3>
                    <p className="text-xs text-emerald-600">
                      {t.basedOn} {timeRange === 'week' ? t.weekly : t.monthly} {t.transactionData}
                    </p>
                  </div>
                </div>
                
                {/* Query display with rounded corners */}
                <div className="mt-2 bg-white px-3 py-2 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex items-center">
                  <FiMessageCircle className="text-emerald-400 mr-2 flex-shrink-0" size={14} />
                  <p className="truncate">{aiPrompt}</p>
                </div>
                
                {/* Close button */}
                <button 
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-emerald-50 transition-colors"
                  aria-label="Close modal"
                >
                  <FiX className="text-emerald-500" />
                </button>
              </div>

              {/* Modal content with custom emerald scrollbar */}
              <div className="flex-grow px-6 py-5 overflow-y-auto emerald-scrollbar">
                <div 
                  className="prose prose-sm max-w-none text-gray-800 prose-headings:text-emerald-700 prose-a:text-emerald-600"
                  dangerouslySetInnerHTML={{ __html: formatAiResponse(aiResponse) }}
                />
              </div>

              {/* Modal footer with emerald styling */}
              <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => fetchAiInsights(aiPrompt)}
                    className="flex items-center text-sm text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <FiRefreshCw className="mr-1.5" size={14} />
                    {t.regenerate}
                  </button>
                  
                  <button 
                    onClick={handleDownloadAdvice}
                    className="flex items-center text-sm text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <FiDownload className="mr-1.5" size={14} />
                    {t.save}
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add global styles for the popup */}
      {showPopup && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
          
          .emerald-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .emerald-scrollbar::-webkit-scrollbar-track {
            background-color: rgba(236, 253, 245, 0.5);
            border-radius: 10px;
          }
          
          .emerald-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(16, 185, 129, 0.3);
            border-radius: 10px;
          }
          
          .emerald-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(6, 95, 70, 0.4);
          }
        `}</style>
      )}
    </>
  );
};

export default AiFinanceAdvisor;
