import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, RefreshCw, Loader2 } from 'lucide-react';

const DUMMY_NEWS = [
  {
    title: "Sensex Surges Past 73,000 Mark",
    summary: "Indian benchmark indices hit new highs led by IT and banking stocks. Foreign investors continue to show confidence in Indian markets.",
    sentiment: "positive"
  },
  {
    title: "RBI Maintains Repo Rate",
    summary: "Reserve Bank of India keeps key interest rates unchanged for the sixth consecutive time, supporting market stability.",
    sentiment: "neutral"
  },
  {
    title: "Global Markets Impact Indian Stocks",
    summary: "Domestic markets face pressure amid global uncertainties and rising oil prices.",
    sentiment: "negative"
  }
];

const SUMMARY_NEWS = {
  title: "Market Overview: All Sectors",
  summary: "Comprehensive market analysis across major sectors: IT showing strong growth with Infosys leading (+2.3%). Banking sector stable with HDFC Bank up 1.5%. Auto sector mixed with Maruti down 0.8%. Pharma sector gaining momentum led by Sun Pharma. Energy sector cautious amid global oil price fluctuations.",
  sectors: [
    { name: "IT", trend: "positive", change: "+2.3%" },
    { name: "Banking", trend: "neutral", change: "+0.5%" },
    { name: "Auto", trend: "negative", change: "-0.8%" },
    { name: "Pharma", trend: "positive", change: "+1.7%" },
    { name: "Energy", trend: "neutral", change: "+0.2%" }
  ]
};

const generateUniqueNews = () => {
  const topics = ['Sensex', 'Nifty', 'Banking Sector', 'IT Sector', 'Auto Sector', 'Pharma Sector'];
  const actions = ['rises', 'gains', 'shows strength', 'advances', 'reaches new high', 'demonstrates growth'];
  const reasons = [
    'following global market cues',
    'driven by strong institutional buying',
    'supported by positive economic data',
    'backed by strong corporate earnings',
    'amid improved market sentiment'
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  const changePercent = (Math.random() * 2 + 0.1).toFixed(1);

  return {
    title: `${topic} ${action} by ${changePercent}%`,
    summary: `The ${topic} ${action} ${reason}. Market analysts suggest maintaining a balanced portfolio with focus on quality stocks.`,
    sentiment: Number(changePercent) > 1.5 ? 'positive' : Number(changePercent) > 0.8 ? 'neutral' : 'negative'
  };
};

const NewsCard = ({ index }) => {
  const [news, setNews] = useState(DUMMY_NEWS[index]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const generateNews = async () => {
    setRefreshing(true);
    try {
      const newNews = generateUniqueNews();
      setNews(newNews);
    } catch (error) {
      console.error('Error generating news:', error);
      setNews({
        title: "Market Update",
        summary: "Unable to fetch latest market news. Please try again later.",
        sentiment: "neutral"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    setLoading(false);
  }, []);

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
            key={news.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex-1 leading-relaxed">{news.title}</h3>
              <button
                onClick={() => generateNews()}
                className="p-3 hover:bg-emerald-50 rounded-full transition-colors ml-2
                  hover:text-emerald-600 active:scale-95"
                title="Generate new update"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <p className="text-gray-700 text-base leading-relaxed tracking-wide">{news.summary}</p>
              <span className={`self-start px-5 py-2 rounded-full text-base font-medium 
                transition-colors ${
                news.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' :
                news.sentiment === 'negative' ? 'bg-red-50 text-red-700 ring-1 ring-red-100' :
                'bg-gray-50 text-gray-700 ring-1 ring-gray-100'
              }`}>
                {news.sentiment}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const SummaryCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 rounded-xl border-2 border-gray-200/60 
        shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-200
        transition-all duration-300 mt-8 p-8"
    >
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-semibold text-gray-900">{SUMMARY_NEWS.title}</h3>
        <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-base font-medium">
          Live Update
        </span>
      </div>
      <p className="text-gray-700 text-lg mb-8 leading-relaxed tracking-wide">{SUMMARY_NEWS.summary}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {SUMMARY_NEWS.sectors.map((sector, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
            <span className="font-medium text-gray-800 text-base">{sector.name}</span>
            <span className={`px-3 py-1.5 rounded text-base font-medium ${
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

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 rounded-full 
            text-emerald-600 text-sm font-medium mb-4 ring-1 ring-emerald-100/50
            shadow-sm"
        >
          <BarChart2 className="w-4 h-4" />
          Real-time Market Updates
        </motion.div>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Latest Stock Market News</h2>
          <button
            onClick={() => setRefreshAll(prev => !prev)}
            className="p-2.5 hover:bg-gray-100/80 rounded-full transition-all
              hover:text-emerald-600 active:scale-95 hover:shadow-sm"
            title="Refresh all news"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((index) => (
            <NewsCard key={`${index}-${refreshAll}`} index={index} />
          ))}
        </div>
        <SummaryCard />
      </div>
    </div>
  );
};

export default StockNews;
