import React, { useState, useEffect } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

//enter the mock data of my finstockapi ok
const STOCK_API_KEY = "API_KEY";
const API_URL = "https://finnhub.io/api/v1";

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

  const stockSymbols = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "TSLA",
    "NVDA",
    "JPM",
    "V",
    "WMT",
  ];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        // in prodenv, use the commented code:
        /*
        const stockData = await Promise.all(
          stockSymbols.map(async (symbol) => {
            const quoteResponse = await fetch(`${API_URL}/quote?symbol=${symbol}&token=${STOCK_API_KEY}`);
            const quoteData = await quoteResponse.json();
            
            const profileResponse = await fetch(`${API_URL}/stock/profile2?symbol=${symbol}&token=${STOCK_API_KEY}`);
            const profileData = await profileResponse.json();
            
            return {
              symbol,
              name: profileData.name || symbol,
              price: quoteData.c || 0,
              change: quoteData.d || 0,
              percentChange: quoteData.dp || 0,
              high: quoteData.h || 0,
              low: quoteData.l || 0,
              prevClose: quoteData.pc || 0,
              marketCap: profileData.marketCapitalization || 0,
              logo: profileData.logo || '',
              historicalPrices: generateMockHistoricalData(quoteData.c || 100, 30),
            };
          })
        );
        */

        const mockStockData = stockSymbols.map((symbol) => {
          const basePrice = Math.random() * 1000 + 50;
          const currentPrice = basePrice + (Math.random() * 20 - 10);
          const change = currentPrice - basePrice;
          const percentChange = (change / basePrice) * 100;

          return {
            symbol,
            name: getCompanyName(symbol),
            price: parseFloat(currentPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            percentChange: parseFloat(percentChange.toFixed(2)),
            high: parseFloat((currentPrice + Math.random() * 5).toFixed(2)),
            low: parseFloat((currentPrice - Math.random() * 5).toFixed(2)),
            prevClose: parseFloat(basePrice.toFixed(2)),
            marketCap: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
            volume: Math.floor(Math.random() * 10000000),
            historicalPrices: generateMockHistoricalData(currentPrice, 30),
          };
        });

        setStocks(mockStockData);
        setFilteredStocks(mockStockData);
        setLoading(false);
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

  const getCompanyName = (symbol) => {
    const companies = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corporation",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com, Inc.",
      META: "Meta Platforms, Inc.",
      TSLA: "Tesla, Inc.",
      NVDA: "NVIDIA Corporation",
      JPM: "JPMorgan Chase & Co.",
      V: "Visa Inc.",
      WMT: "Walmart Inc.",
    };
    return companies[symbol] || symbol;
  };

  const generateMockHistoricalData = (currentPrice, days) => {
    const data = [];
    let price = currentPrice;

    for (let i = days; i > 0; i--) {
      price = price + (Math.random() * 10 - 5);
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        price: parseFloat(price.toFixed(2)),
      });
    }

    data.push({
      date: new Date().toISOString().split("T")[0],
      price: parseFloat(currentPrice.toFixed(2)),
    });

    return data;
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const SparklineChart = ({ data, width = 100, height = 30, color }) => {
    if (!data || data.length === 0) return null;

    const prices = data.map((item) => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    const normalizedPrices =
      range === 0
        ? prices.map(() => height / 2)
        : prices.map((price) => height - ((price - minPrice) / range) * height);

    const points = normalizedPrices
      .map((price, i) => `${(i / (prices.length - 1)) * width},${price}`)
      .join(" ");

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold">Loading stock data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  const topGainers = [...stocks]
    .sort((a, b) => b.percentChange - a.percentChange)
    .slice(0, 3);

  return (
    <div>
      <DashboardLayout>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Stock Market Dashboard</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4"
                  style={{
                    borderLeftColor: stock.change >= 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{stock.symbol}</h3>
                      <p className="text-gray-600 text-sm">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ${stock.price.toLocaleString()}
                      </p>
                      <p
                        className={`flex items-center ${
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}
                        {stock.change.toFixed(2)} (
                        {stock.percentChange.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <SparklineChart
                      data={stock.historicalPrices}
                      color={stock.change >= 0 ? "#10b981" : "#ef4444"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">All Stocks</h2>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Search stocks by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("symbol")}
                    >
                      <div className="flex items-center">
                        Symbol
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("change")}
                    >
                      <div className="flex items-center">
                        Change
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("percentChange")}
                    >
                      <div className="flex items-center">
                        % Change
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Chart
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("marketCap")}
                    >
                      <div className="flex items-center">
                        Market Cap (B)
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStocks.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {stock.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stock.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${stock.price.toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          stock.percentChange >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )}
                          {stock.percentChange.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <SparklineChart
                          data={stock.historicalPrices}
                          color={stock.change >= 0 ? "#10b981" : "#ef4444"}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${stock.marketCap.toLocaleString()}B
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStocks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No stocks found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Market;
