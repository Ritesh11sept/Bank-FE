import { useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiArrowDown, FiArrowUp, FiChevronRight, FiFilter } from "react-icons/fi";
import { useGetUserTransactionsQuery } from "../../state/api";
import Avatar from "react-avatar";

const RecentTransactions = () => {
  const [filter, setFilter] = useState("all"); // all, incoming, outgoing
  const { data: transactionsData, isLoading } = useGetUserTransactionsQuery();
  
  // Get transactions from API data
  const transactions = transactionsData?.transactions || [];
  
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "incoming") return transaction.type === "credit";
    if (filter === "outgoing") return transaction.type === "debit";
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Recent Transactions</h2>
          <p className="text-gray-500 text-sm">Your recent money movements</p>
        </div>
        <div className="p-2 bg-purple-100 rounded-lg">
          <FiClock className="h-6 w-6 text-purple-600" />
        </div>
      </div>
      
      <div className="flex mb-4 gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
            filter === "all" 
              ? "bg-gray-800 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("incoming")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
            filter === "incoming" 
              ? "bg-green-600 text-white" 
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <FiArrowDown className="mr-1" size={14} /> Incoming
        </button>
        <button
          onClick={() => setFilter("outgoing")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
            filter === "outgoing" 
              ? "bg-red-600 text-white" 
              : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          <FiArrowUp className="mr-1" size={14} /> Outgoing
        </button>
        
        <div className="ml-auto">
          <button className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            <FiFilter size={18} />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse flex justify-between p-3 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-gray-200 rounded mb-2 ml-auto"></div>
                <div className="h-3 w-20 bg-gray-200 rounded ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-1">
          {filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === "credit" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {transaction.type === "credit" ? (
                    <FiArrowDown size={16} />
                  ) : (
                    <FiArrowUp size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {transaction.type === "credit" 
                      ? `From: ${transaction.senderName || transaction.senderId}` 
                      : `To: ${transaction.receiverName || transaction.receiverId}`}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-2">
                  <p className={`font-medium ${
                    transaction.type === "credit" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                    {transaction.note || (transaction.type === "credit" ? "Received payment" : "Sent payment")}
                  </p>
                </div>
                <FiChevronRight className="opacity-0 group-hover:opacity-100 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiClock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No transactions yet</h3>
          <p className="text-gray-500 text-sm">
            Your transaction history will appear here after you make your first transfer
          </p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
          View All Transactions <FiChevronRight className="ml-1" size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default RecentTransactions;
