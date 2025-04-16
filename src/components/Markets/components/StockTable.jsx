import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, LineChart } from "lucide-react";
import SparklineChart from "./SparklineChart";

const StockTable = ({ stocks, requestSort, sortConfig, getStockAnalysis }) => {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-8 bg-emerald-50 rounded-lg border border-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-emerald-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-emerald-700 font-medium">No stocks found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-100 shadow-sm">
      <table className="min-w-full divide-y divide-emerald-100">
        <thead className="bg-emerald-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("symbol")}
            >
              <div className="flex items-center">
                Symbol
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Name
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("price")}
            >
              <div className="flex items-center">
                Price (₹)
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("change")}
            >
              <div className="flex items-center">
                Change
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("percentChange")}
            >
              <div className="flex items-center">
                % Change
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider"
            >
              Chart
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("sector")}
            >
              <div className="flex items-center">
                Sector
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors duration-200"
              onClick={() => requestSort("peRatio")}
            >
              <div className="flex items-center">
                P/E Ratio
                <ArrowUpDown size={14} className="ml-1 text-emerald-500" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-emerald-50">
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="hover:bg-emerald-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                {stock.symbol.split('.')[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {stock.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ₹{stock.price.toLocaleString()}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  stock.percentChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <div className="flex items-center">
                  {stock.change >= 0 ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {stock.percentChange.toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <SparklineChart
                  data={stock.historicalPrices}
                  color={stock.change >= 0 ? "#059669" : "#dc2626"}
                  width={100}
                  height={30}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-medium">
                  {stock.sector}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {stock.peRatio.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => getStockAnalysis(stock)}
                  className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center text-xs font-medium"
                >
                  <LineChart size={14} className="mr-1" />
                  Analyze
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
