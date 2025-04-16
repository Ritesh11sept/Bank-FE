import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, RefreshCw, Loader2 } from 'lucide-react';
import axios from 'axios';

// Initialize Gemini API service - Fix the environment variable access for Vite
const geminiApiKey = import.meta.env.VITE_API_KEY;

// Function to fetch market news from Gemini API
const fetchMarketNews = async (topic = 'general market update') => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{
            text: `Generate a short, factual summary of the latest Indian stock market updates about ${topic}. 
                  Include a title, a 1-2 sentence summary max 40 words, and classify the sentiment as positive, negative, or neutral.
                  Return the data in JSON format like this: 
                  { "title": "Title here", "summary": "Summary here", "sentiment": "positive/negative/neutral" }`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        }
      }
    );

    // Extract and parse JSON from the response text
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse JSON response");
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw error;
  }
};

// Function to fetch sector data
const fetchSectorData = async () => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{
            text: `Generate the latest realistic market data for 5 major sectors in the Indian stock market.
                  Include a title, a comprehensive summary, and data for 5 key sectors (IT, Banking, Auto, Pharma, Energy).
                  For each sector, provide a trend (positive, negative, or neutral) and a realistic percentage change.
                  Return the data in JSON format like this:
                  { 
                    "title": "Market Overview: All Sectors", 
                    "summary": "Comprehensive analysis here...",
                    "sectors": [
                      { "name": "IT", "trend": "positive/negative/neutral", "change": "+/-X.X%" },
                      ... (for all 5 sectors)
                    ]
                  }`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      }
    );

    // Extract and parse JSON from the response text
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse JSON response");
  } catch (error) {
    console.error("Error fetching sector data from Gemini API:", error);
    throw error;
  }
};

const NEWS_TOPICS = ['Sensex', 'Nifty', 'Banking Sector', 'IT Sector', 'Auto Sector', 'Pharma Sector'];

const NewsCard = ({ index }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const generateNews = async () => {
    setRefreshing(true);
    try {
      const topic = NEWS_TOPICS[index % NEWS_TOPICS.length];
      const newNews = await fetchMarketNews(topic);
      setNews(newNews);
    } catch (error) {
      console.error('Error generating news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    generateNews();
  }, []);

  if (loading && !news) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/95 rounded-xl border-2 border-gray-200/60 
          shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
          backdrop-blur-sm min-h-[320px] flex flex-col items-center justify-center"
      >
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-gray-500 mt-4">Loading market data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/95 rounded-xl border-2 border-gray-200/60 
        shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-200
        hover:-translate-y-1 transition-all duration-300 overflow-hidden
        backdrop-blur-sm min-h-[320px] flex flex-col"
    >
      {loading || refreshing ? (
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={news?.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 leading-relaxed line-clamp-2">{news?.title}</h3>
              <button
                onClick={() => generateNews()}
                className="p-2 sm:p-3 hover:bg-emerald-50 rounded-full transition-colors ml-2
                  hover:text-emerald-600 active:scale-95 flex-shrink-0"
                title="Generate new update"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed tracking-wide line-clamp-4 sm:line-clamp-none">{news?.summary}</p>
              <span className={`self-start px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-medium 
                transition-colors ${
                news?.sentiment === 'positive' ? 'bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-100' :
                news?.sentiment === 'negative' ? 'bg-red-50/80 text-red-700 ring-1 ring-red-100' :
                'bg-gray-50/80 text-gray-700 ring-1 ring-gray-100'
              }`}>
                {news?.sentiment === 'positive' ? 'Bullish' : 
                 news?.sentiment === 'negative' ? 'Bearish' : 'Neutral'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const SummaryCard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummaryData = async () => {
      try {
        const data = await fetchSectorData();
        setSummaryData(data);
      } catch (error) {
        console.error("Failed to load sector data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSummaryData();
  }, []);

  if (loading || !summaryData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 rounded-xl border-2 border-gray-200/60 
          shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
          transition-all duration-300 mt-6 sm:mt-8 p-4 sm:p-8 min-h-[300px]
          flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-gray-500 mt-4">Loading sector data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 rounded-xl border-2 border-gray-200/60 
        shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-200
        transition-all duration-300 mt-6 sm:mt-8 p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4 sm:mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{summaryData.title}</h3>
        <span className="self-start bg-emerald-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Update
        </span>
      </div>
      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed tracking-wide">{summaryData.summary}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        {summaryData.sectors.map((sector, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50/80 border border-gray-100 
              hover:bg-gray-100/80 transition-colors duration-200 hover:shadow-sm group"
          >
            <span className="font-medium text-gray-800 text-sm sm:text-base">{sector.name}</span>
            <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded text-sm sm:text-base font-medium 
              transition-all duration-300 group-hover:translate-y-[-2px] ${
              sector.trend === 'positive' ? 'text-emerald-700' :
              sector.trend === 'negative' ? 'text-red-700' :
              'text-gray-700'
            }`}>
              {sector.change}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const StockNews = () => {
  const [refreshAll, setRefreshAll] = useState(false);

  const handleRefreshAll = () => {
    setRefreshAll(prev => !prev);
  };

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="text-center mb-8 sm:mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2 bg-emerald-50 rounded-full 
            text-emerald-600 text-xs sm:text-sm font-medium mb-3 sm:mb-4 ring-1 ring-emerald-100/50
            shadow-sm"
        >
          <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4" />
          Real-time Market Updates
        </motion.div>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Latest Stock Market News</h2>
          <button
            onClick={handleRefreshAll}
            className="p-2 sm:p-2.5 hover:bg-gray-100/80 rounded-full transition-all
              hover:text-emerald-600 active:scale-95 hover:shadow-sm"
            title="Refresh all news"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {[0, 1, 2].map((index) => (
        <NewsCard key={`${index}-${refreshAll}`} index={index} />
      ))}
    </div>
    <SummaryCard key={refreshAll} />
  </div>
  </div>
);

};

export default StockNews;
