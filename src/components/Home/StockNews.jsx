import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, RefreshCw, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../../context/TranslationContext';

// Initialize Gemini API service - Fix the environment variable access for Vite
const geminiApiKey = import.meta.env.VITE_API_KEY;

// Function to fetch market news from Gemini API with language support
const fetchMarketNews = async (topic = 'general market update', language = 'english') => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Determine the prompt language
    const langPrefix = language === 'hindi' ? 'in Hindi language' : '';
    const responseFormat = language === 'hindi' 
      ? '{ "title": "Hindi title here", "summary": "Hindi summary here", "sentiment": "positive/negative/neutral" }'
      : '{ "title": "Title here", "summary": "Summary here", "sentiment": "positive/negative/neutral" }';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{
            text: `Generate a short, factual summary ${langPrefix} of the latest Indian stock market updates about ${topic}. 
                  Include a title, a 1-2 sentence summary max 40 words, and classify the sentiment as positive, negative, or neutral.
                  Return the data in JSON format like this: 
                  ${responseFormat}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        }
      },
      { signal: controller.signal }
    );

    // Clear timeout since request completed
    clearTimeout(timeoutId);

    // Validate the response structure
    if (!response.data || !response.data.candidates || !response.data.candidates[0] || 
        !response.data.candidates[0].content || !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0] || !response.data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid API response structure");
    }

    // Extract and parse JSON from the response text
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedData = JSON.parse(jsonMatch[0]);
        
        // Validate the returned JSON structure
        if (!parsedData.title || !parsedData.summary || !parsedData.sentiment) {
          throw new Error("Incomplete data in API response");
        }
        
        return parsedData;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Failed to parse API response");
      }
    }
    throw new Error("Failed to extract JSON from response");
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    
    // Return robust fallback data in the selected language
    return getFallbackNewsData(language, topic);
  }
};

// Helper function to get fallback news data based on topic and language
const getFallbackNewsData = (language, topic = '') => {
  // Normalize the topic to match against preset topics
  const normalizedTopic = topic.toLowerCase();
  
  // Specific fallbacks for common topics
  if (language === 'hindi') {
    if (normalizedTopic.includes('सेंसेक्स')) {
      return {
        title: "सेंसेक्स में उतार-चढ़ाव",
        summary: "सेंसेक्स में हाल ही में उतार-चढ़ाव देखा गया है। बाजार की स्थिति आर्थिक कारकों पर निर्भर करती है।",
        sentiment: "neutral"
      };
    } else if (normalizedTopic.includes('निफ्टी')) {
      return {
        title: "निफ्टी बाजार अपडेट",
        summary: "निफ्टी सूचकांक वर्तमान में बाजार परिस्थितियों के अनुसार समायोजित हो रहा है।",
        sentiment: "neutral"
      };
    } else if (normalizedTopic.includes('बैंकिंग')) {
      return {
        title: "बैंकिंग क्षेत्र की स्थिति",
        summary: "वित्तीय क्षेत्र में बैंकों का प्रदर्शन रिज़र्व बैंक की नीतियों से प्रभावित है।",
        sentiment: "neutral"
      };
    }
    // Default Hindi fallback
    return {
      title: "बाजार अपडेट",
      summary: "अस्थायी रूप से बाजार डेटा उपलब्ध नहीं है। जल्द ही नई जानकारी अपडेट की जाएगी।",
      sentiment: "neutral"
    };
  } else {
    // English fallbacks
    if (normalizedTopic.includes('sensex')) {
      return {
        title: "Sensex Market Update",
        summary: "The Sensex has shown typical market fluctuations recently, reflecting the broader economic conditions.",
        sentiment: "neutral"
      };
    } else if (normalizedTopic.includes('nifty')) {
      return {
        title: "Nifty Index Status",
        summary: "The Nifty index is currently adjusting to market conditions and economic factors.",
        sentiment: "neutral"
      };
    } else if (normalizedTopic.includes('banking')) {
      return {
        title: "Banking Sector Overview",
        summary: "Banking stocks are influenced by RBI policies and overall financial market performance.",
        sentiment: "neutral"
      };
    }
    // Default English fallback
    return {
      title: "Market Update",
      summary: "Market data is temporarily unavailable. New information will be updated soon.",
      sentiment: "neutral"
    };
  }
};

// Function to fetch sector data with language support
const fetchSectorData = async (language = 'english') => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Determine the prompt language
    const langPrefix = language === 'hindi' ? 'in Hindi language' : '';
    const sectorNames = language === 'hindi' 
      ? '(आईटी, बैंकिंग, ऑटो, फार्मा, ऊर्जा)' 
      : '(IT, Banking, Auto, Pharma, Energy)';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{
            text: `Generate the latest realistic market data ${langPrefix} for 5 major sectors in the Indian stock market.
                  Include a title, a comprehensive summary, and data for 5 key sectors ${sectorNames}.
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
      },
      { signal: controller.signal }
    );

    // Clear timeout since request completed
    clearTimeout(timeoutId);

    // Extract and parse JSON from the response text
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Validate the returned JSON structure
      if (!parsedData.title || !parsedData.summary || !Array.isArray(parsedData.sectors) || parsedData.sectors.length < 5) {
        throw new Error("Incomplete data in API response");
      }
      
      return parsedData;
    }
    throw new Error("Failed to parse JSON response");
  } catch (error) {
    console.error("Error fetching sector data from Gemini API:", error);
    return getFallbackSectorData(language);
  }
};

// Helper function to get more detailed fallback sector data
const getFallbackSectorData = (language) => {
  return language === 'hindi' 
    ? {
        title: "बाजार अवलोकन: सभी सेक्टर",
        summary: "वर्तमान में विस्तृत सेक्टर डेटा उपलब्ध नहीं है। कनेक्शन की जांच करें और पुनः प्रयास करें। हमारे सर्वर पर अधिक भार के कारण डेटा लोड करने में समस्या हो सकती है।",
        sectors: [
          { name: "आईटी", trend: "neutral", change: "0.0%" },
          { name: "बैंकिंग", trend: "neutral", change: "0.0%" },
          { name: "ऑटो", trend: "neutral", change: "0.0%" },
          { name: "फार्मा", trend: "neutral", change: "0.0%" },
          { name: "ऊर्जा", trend: "neutral", change: "0.0%" }
        ]
      }
    : {
        title: "Market Overview: All Sectors",
        summary: "Detailed sector data is currently unavailable. Please check your connection and try again. Our servers may be experiencing high load at the moment.",
        sectors: [
          { name: "IT", trend: "neutral", change: "0.0%" },
          { name: "Banking", trend: "neutral", change: "0.0%" },
          { name: "Auto", trend: "neutral", change: "0.0%" },
          { name: "Pharma", trend: "neutral", change: "0.0%" },
          { name: "Energy", trend: "neutral", change: "0.0%" }
        ]
      };
};

const NEWS_TOPICS = {
  english: ['Sensex', 'Nifty', 'Banking Sector', 'IT Sector', 'Auto Sector', 'Pharma Sector'],
  hindi: ['सेंसेक्स', 'निफ्टी', 'बैंकिंग सेक्टर', 'आईटी सेक्टर', 'ऑटो सेक्टर', 'फार्मा सेक्टर']
};

const NewsCard = ({ index }) => {
  const { translations, language } = useTranslation();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2; // Maximum number of automatic retries

  const generateNews = async () => {
    setRefreshing(true);
    setError(false);
    try {
      const topicsForLanguage = NEWS_TOPICS[language] || NEWS_TOPICS.english;
      const topic = topicsForLanguage[index % topicsForLanguage.length];
      const newNews = await fetchMarketNews(topic, language);
      setNews(newNews);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error generating news:', err);
      setError(true);
      // Auto retry if under max attempts
      if (retryCount < maxRetries) {
        console.log(`Auto-retrying fetch (${retryCount + 1}/${maxRetries})...`);
        setRetryCount(prev => prev + 1);
        // Wait a moment before retry
        setTimeout(() => generateNews(), 1000);
        return;
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Regenerate news when language changes
  useEffect(() => {
    generateNews();
  }, [language]);

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
        <p className="text-gray-500 mt-4">{translations.stockNews.loadingMarketData}</p>
      </motion.div>
    );
  }

  // Translation for sentiment labels
  const sentimentLabel = {
    positive: translations.stockNews.bullish,
    negative: translations.stockNews.bearish,
    neutral: translations.stockNews.neutral
  };

  // Use key with retry count to force re-render on auto-retry
  return (
    <motion.div
      key={`news-card-${index}-${retryCount}`}
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
                title={translations.stockNews.generateNewUpdate}
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed tracking-wide line-clamp-4 sm:line-clamp-none">{news?.summary}</p>
              <span className={`self-start px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-medium 
                transition-colors ${
                news?.sentiment === 'positive' || sentimentLabel[news?.sentiment] === translations.stockNews.bullish 
                  ? 'bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-100' :
                news?.sentiment === 'negative' || sentimentLabel[news?.sentiment] === translations.stockNews.bearish
                  ? 'bg-red-50/80 text-red-700 ring-1 ring-red-100' :
                'bg-gray-50/80 text-gray-700 ring-1 ring-gray-100'
              }`}>
                {sentimentLabel[news?.sentiment] || sentimentLabel.neutral}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const SummaryCard = () => {
  const { translations, language } = useTranslation();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchSectorData(language);
      setSummaryData(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Failed to load sector data:", err);
      setError(true);
      
      // Auto retry if under max attempts
      if (retryCount < maxRetries) {
        console.log(`Auto-retrying sector data fetch (${retryCount + 1}/${maxRetries})...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadSummaryData(), 1200);
        return;
      }
      
      // If all retries fail, use fallback data
      setSummaryData(getFallbackSectorData(language));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummaryData();
  }, [language]);

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
          <p className="text-gray-500 mt-4">{translations.stockNews.loadingSectorData}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`summary-card-${retryCount}`}
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
          {translations.stockNews.liveUpdate}
        </span>
      </div>
      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed tracking-wide">{summaryData.summary}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        {summaryData.sectors.map((sector, index) => {
          const isPositive = sector.trend === 'positive' || 
            (language === 'hindi' && sector.trend === 'सकारात्मक');
          const isNegative = sector.trend === 'negative' || 
            (language === 'hindi' && sector.trend === 'नकारात्मक');
            
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50/80 border border-gray-100 
                hover:bg-gray-100/80 transition-colors duration-200 hover:shadow-sm group"
            >
              <span className="font-medium text-gray-800 text-sm sm:text-base">{sector.name}</span>
              <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded text-sm sm:text-base font-medium 
                transition-all duration-300 group-hover:translate-y-[-2px] ${
                isPositive ? 'text-emerald-700' :
                isNegative ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {sector.change}
              </span>
            </div>
          );
        })}
      </div>
      {/* Improved error display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-center">
          <p className="font-medium mb-2">
            {language === 'hindi' 
              ? 'डेटा अपडेट करने में त्रुटि'
              : 'Error updating data'}
          </p>
          <p className="text-sm">
            {language === 'hindi' 
              ? 'अपने इंटरनेट कनेक्शन की जांच करें और पुनः प्रयास करें।'
              : 'Please check your internet connection and try again.'}
          </p>
          <button 
            onClick={loadSummaryData}
            className="mt-3 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            {language === 'hindi' ? 'पुनः प्रयास करें' : 'Try Again'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

const StockNews = () => {
  const { translations, language } = useTranslation();
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
          {translations.stockNews.realTimeMarketUpdates}
        </motion.div>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{translations.stockNews.latestStockMarketNews}</h2>
          <button
            onClick={handleRefreshAll}
            className="p-2 sm:p-2.5 hover:bg-gray-100/80 rounded-full transition-all
              hover:text-emerald-600 active:scale-95 hover:shadow-sm"
            title={translations.stockNews.refreshAllNews}
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[0, 1, 2].map((index) => (
            <NewsCard key={`${index}-${refreshAll}-${language}`} index={index} />
          ))}
        </div>
        <SummaryCard key={`${refreshAll}-${language}`} />
      </div>
    </div>
  );
};

export default StockNews;
