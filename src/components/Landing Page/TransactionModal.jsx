import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FiX, FiArrowDown, FiArrowUp, FiFilter, FiSearch, 
  FiChevronLeft, FiChevronRight, FiDownload, FiCheck
} from "react-icons/fi";

const TransactionModal = ({ 
  transactions, 
  onClose, 
  formatDate, 
  getTransactionDisplay, 
  currentUserId,
  translations 
}) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef(null);
  const transactionsPerPage = 10;

  // Use translations or provide fallbacks if not passed
  const t = translations || {
    title: "All Transactions",
    all: "All",
    incoming: "Incoming",
    outgoing: "Outgoing",
    noTransactionsYet: "No transactions found",
    noTransactionsDescription: "Try changing your filter settings"
  };
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  
  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Apply type filter
    if (filter !== "all") {
      const userId = currentUserId || localStorage.getItem('userId');
      const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
      const senderId = String(transaction.senderId?.$oid || transaction.senderId);
      
      const isIncoming = receiverId === userId;
      const isOutgoing = senderId === userId;
      
      if (filter === "incoming" && !isIncoming) return false;
      if (filter === "outgoing" && !isOutgoing) return false;
    }
    
    // Apply search term
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      return (
        (transaction.senderName && transaction.senderName.toLowerCase().includes(searchLower)) ||
        (transaction.receiverName && transaction.receiverName.toLowerCase().includes(searchLower)) ||
        (transaction.note && transaction.note.toLowerCase().includes(searchLower)) ||
        String(transaction.amount).includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);
  
  // Format transaction amount with INR symbol
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Export transactions as CSV
  const exportTransactions = () => {
    // Create CSV content
    let csvContent = "Date,Type,Amount,From,To,Note,Status\n";
    
    filteredTransactions.forEach(transaction => {
      const userId = currentUserId || localStorage.getItem('userId');
      const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
      const isIncoming = receiverId === userId;
      
      const row = [
        new Date(transaction.date).toISOString().split('T')[0],
        isIncoming ? "Incoming" : "Outgoing",
        transaction.amount,
        transaction.senderName,
        transaction.receiverName,
        `"${transaction.note || ''}"`,
        transaction.status
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3">
          <div className="flex flex-1 min-w-[200px]">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === "all" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setFilter("incoming")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "incoming" 
                  ? "bg-green-600 text-white" 
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              <FiArrowDown className="inline mr-1" size={14} /> {t.incoming}
            </button>
            <button
              onClick={() => setFilter("outgoing")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === "outgoing" 
                  ? "bg-red-600 text-white" 
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <FiArrowUp className="inline mr-1" size={14} /> {t.outgoing}
            </button>
          </div>
          
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={exportTransactions}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center font-medium"
          >
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
        
        {/* Transaction List */}
        <div className="overflow-y-auto flex-grow">
          {currentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FiFilter className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">{t.noTransactionsYet}</h3>
              <p className="text-gray-500">{t.noTransactionsDescription}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction) => {
                  const {
                    isIncoming, statusColor, amountDisplay, amountColor, 
                    party, description
                  } = getTransactionDisplay(transaction);
                  
                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${isIncoming ? "bg-green-100" : "bg-red-100"}`}>
                            {isIncoming ? <FiArrowDown className="text-green-600" /> : <FiArrowUp className="text-red-600" />}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{party}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${amountColor}`}>{amountDisplay}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === "completed" ? "bg-green-100 text-green-800" :
                          transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {transaction.status === "completed" && <FiCheck className="mr-1" size={12} />}
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {Math.min(indexOfFirstTransaction + 1, filteredTransactions.length)} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 
                    ? "text-gray-300 cursor-not-allowed" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronLeft size={20} />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show (center current page when possible)
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages 
                    ? "text-gray-300 cursor-not-allowed" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TransactionModal;
