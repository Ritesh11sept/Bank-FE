import React, { useState, useEffect } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import StockTable from "./components/StockTable";
import AiRecommendations from "./components/AiRecommendations";
import StockAnalysisModal from "./components/StockAnalysisModal";
import MarketHeader from "./components/MarketHeader";
import { generateMockHistoricalData, getCompanyName } from "./utils/marketUtils";

const ALPHA_VANTAGE_API_KEY = import.meta.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "IAC8TV9BJANVO1ZI";
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const ALPHA_VANTAGE_API_URL = "https://www.alphavantage.co/query";

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "symbol",
    direction: "ascending",
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");

  const stockSymbols = [
    "RELIANCE.BSE",
    "TCS.BSE",
    "HDFCBANK.BSE",
    "INFY.BSE",
    "HINDUNILVR.BSE",
    "ICICIBANK.BSE",
    "SBIN.BSE",
    "BHARTIARTL.BSE",
    "WIPRO.BSE",
    "HCLTECH.BSE",
  ];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        // Using traditional ALPHA_VANTAGE API approach
        const fetchAlphaVantageData = async (symbol) => {
          try {
            const params = new URLSearchParams({
              function: "GLOBAL_QUOTE",
              symbol: symbol.split('.')[0],
              apikey: ALPHA_VANTAGE_API_KEY
            });
            
            const response = await fetch(`${ALPHA_VANTAGE_API_URL}?${params}`);
            if (!response.ok) throw new Error("Failed to fetch Alpha Vantage data");
            
            const data = await response.json();
            const quote = data["Global Quote"];
            
            if (quote && quote["01. symbol"]) {
              return {
                price: parseFloat(quote["05. price"]),
                high: parseFloat(quote["03. high"]),
                low: parseFloat(quote["04. low"]),
              };
            }
            return null;
          } catch (error) {
            console.warn(`Alpha Vantage API error for ${symbol}:`, error);
            return null;
          }
        };

        const mockStockData = await Promise.all(
          stockSymbols.map(async (symbol) => {
            // Try to get real data first
            const realData = await fetchAlphaVantageData(symbol);
            
            // Use realistic mock data as fallback
            const basePrice = realData?.price || Math.random() * 3000 + 500;
            const currentPrice = realData?.price || basePrice + (Math.random() * 50 - 25);
            const change = currentPrice - basePrice;
            const percentChange = (change / basePrice) * 100;
            const sectorMap = {
              "RELIANCE.BSE": "Energy",
              "TCS.BSE": "Information Technology",
              "HDFCBANK.BSE": "Financial Services",
              "INFY.BSE": "Information Technology",
              "HINDUNILVR.BSE": "Consumer Goods",
              "ICICIBANK.BSE": "Financial Services",
              "SBIN.BSE": "Financial Services",
              "BHARTIARTL.BSE": "Telecommunications",
              "WIPRO.BSE": "Information Technology",
              "HCLTECH.BSE": "Information Technology",
            };

            return {
              symbol,
              name: getCompanyName(symbol),
              price: parseFloat(currentPrice.toFixed(2)),
              change: parseFloat(change.toFixed(2)),
              percentChange: parseFloat(percentChange.toFixed(2)),
              high: parseFloat((realData?.high || currentPrice + Math.random() * 30).toFixed(2)),
              low: parseFloat((realData?.low || currentPrice - Math.random() * 30).toFixed(2)),
              prevClose: parseFloat(basePrice.toFixed(2)),
              marketCap: parseFloat((Math.random() * 200 + 10).toFixed(2)),
              volume: Math.floor(Math.random() * 10000000),
              sector: sectorMap[symbol] || "N/A",
              peRatio: parseFloat((Math.random() * 50 + 5).toFixed(2)),
              historicalPrices: generateMockHistoricalData(currentPrice, 30),
            };
          })
        );

        setStocks(mockStockData);
        setFilteredStocks(mockStockData);
        setLoading(false);

        generateAiRecommendations(mockStockData);
      } catch (err) {
        setError("Failed to fetch stock data");
        setLoading(false);
        console.error("Error fetching stock data:", err);
      }
    };

    fetchStockData();

    const intervalId = setInterval(() => {
      fetchStockData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const generateAiRecommendations = async (stockData) => {
    setAiLoading(true);
    try {
      setTimeout(() => {
        const topStocks = [...stockData]
          .sort((a, b) => {
            const aScore = a.percentChange - (a.peRatio / 10) + (Math.random() * 5);
            const bScore = b.percentChange - (b.peRatio / 10) + (Math.random() * 5);
            return bScore - aScore;
          })
          .slice(0, 3);
        
        const mockRecommendations = topStocks.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          reason: generateRecommendationReason(stock),
          confidence: Math.floor(Math.random() * 30 + 70),
          price: stock.price,
          change: stock.percentChange
        }));
        
        setAiRecommendations(mockRecommendations);
        setAiLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      setAiLoading(false);
    }
  };

  const generateRecommendationReason = (stock) => {
    const reasons = [
      `Strong growth potential in the ${stock.sector} sector with favorable PE ratio of ${stock.peRatio.toFixed(2)}.`,
      `Solid financial performance with recent momentum of ${stock.percentChange > 0 ? '+' : ''}${stock.percentChange.toFixed(2)}%.`,
      `Undervalued stock with significant upside potential based on technical analysis.`,
      `Market leader in ${stock.sector} with robust volume of ${(stock.volume/1000000).toFixed(2)}M shares.`,
      `Consistent performance with good entry point at current price level of ₹${stock.price.toFixed(2)}.`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getStockAnalysis = async (stock) => {
    setSelectedStock(stock);
    setAiAnalysis("Generating analysis..."); 
    
    // We'll move the detailed analysis generation to the StockAnalysisModal component
    // Just pass the stock data to the modal and let it handle the rendering
    try {
      setTimeout(() => {
        // Only pass the essential data for analysis
        const analysisData = {
          stock: stock,
          sentiment: stock.percentChange > 0 ? "positive" : "negative",
          recommendation: stock.percentChange > 2 ? "Buy" : (stock.percentChange > -2 ? "Hold" : "Sell")
        };
        
        setAiAnalysis(JSON.stringify(analysisData));
      }, 2000);
    } catch (error) {
      console.error("Error generating stock analysis:", error);
      setAiAnalysis("Failed to generate analysis. Please try again later.");
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedStocks = [...filteredStocks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredStocks(sortedStocks);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-emerald-700">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading stock data...
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-6 py-8 bg-white min-h-screen">
        <MarketHeader />
        
        <AiRecommendations 
          recommendations={aiRecommendations} 
          loading={aiLoading} 
          getStockAnalysis={getStockAnalysis} 
          stocks={stocks}
        />
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-emerald-800 flex items-center">
            <span className="bg-emerald-100 p-1 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Market Overview
          </h2>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="bg-white border-2 border-emerald-100 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5 transition-all duration-200"
              placeholder="Search by symbol, company name, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <StockTable 
            stocks={filteredStocks} 
            requestSort={requestSort} 
            sortConfig={sortConfig}
            getStockAnalysis={getStockAnalysis}
          />
        </div>

        {selectedStock && (
          <StockAnalysisModal 
            selectedStock={selectedStock} 
            aiAnalysis={aiAnalysis} 
            onClose={() => {
              setSelectedStock(null);
              setAiAnalysis("");
            }} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Market;
