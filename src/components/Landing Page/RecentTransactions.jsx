import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiArrowDown, FiArrowUp, FiChevronRight, FiFilter, FiCheckCircle } from "react-icons/fi";
import { useGetUserTransactionsQuery, useGetUserProfileQuery } from "../../state/api";
import { TranslationContext2 } from "../../context/TranslationContext2";
import TransactionModal from "./TransactionModal";

const RecentTransactions = () => {
  // Get translations from context
  const { translations } = useContext(TranslationContext2) || {};
  
  // Access translations with fallback
  const t = translations?.recentTransactions || {
    title: "Recent Transactions",
    subtitle: "'s last {0} transactions",
    your: "Your",
    all: "All",
    incoming: "Incoming",
    outgoing: "Outgoing",
    from: "From: {0}",
    to: "To: {0}",
    unknown: "Unknown",
    receivedPayment: "Received payment",
    sentPayment: "Sent payment",
    noTransactionsYet: "No transactions yet",
    noTransactionsDescription: "Your transaction history will appear here after you make your first transfer",
    viewAllTransactions: "View All Transactions"
  };
  
  // Helper function to format translation strings with parameters
  const formatTranslation = (template, ...args) => {
    return template.replace(/{(\d+)}/g, (match, index) => {
      return args[index] !== undefined ? args[index] : match;
    });
  };
  
  const [filter, setFilter] = useState("all"); // all, incoming, outgoing
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const { data: transactionsData, isLoading, refetch } = useGetUserTransactionsQuery();
  const { data: userProfile } = useGetUserProfileQuery();
  
  // Ensure user ID is consistent throughout the component
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));
  
  // Update userId when profile loads and refetch transactions
  useEffect(() => {
    if (userProfile && userProfile._id) {
      const profileId = userProfile._id;
      if (profileId !== currentUserId) {
        console.log(`Updating current user ID from ${currentUserId} to ${profileId}`);
        setCurrentUserId(profileId);
        localStorage.setItem('userId', profileId);
        refetch(); // Refetch transactions with updated userId
      }
    }
  }, [userProfile, currentUserId, refetch]);
  
  // Debug transactions data 
  useEffect(() => {
    if (transactionsData?.transactions?.length > 0) {
      // Log some transaction samples for debugging
      const sampleTransactions = transactionsData.transactions.slice(0, 3);
      
      console.log('Transaction samples for debugging:');
      sampleTransactions.forEach((t, i) => {
        const receiverId = String(t.receiverId?.$oid || t.receiverId);
        const senderId = String(t.senderId?.$oid || t.senderId);
        const isIncoming = receiverId === currentUserId;
        const isOutgoing = senderId === currentUserId;
        
        console.log(`Transaction ${i+1} - ID: ${t._id}`);
        console.log(`- Current user: ${currentUserId}`);
        console.log(`- Sender ID: ${senderId}, Receiver ID: ${receiverId}`);
        console.log(`- Sender: ${t.senderName}, Receiver: ${t.receiverName}`);
        console.log(`- Is incoming: ${isIncoming}, Is outgoing: ${isOutgoing}`);
        console.log(`- Amount: ${t.amount}, Note: ${t.note || 'None'}`);
      });
    }
  }, [transactionsData, currentUserId]);
  
  // Get transactions from API data
  const transactions = transactionsData?.transactions || [];
  
  // Apply filtering with improved logic for current user
  const filteredTransactions = transactions.filter(transaction => {
    // Process MongoDB ObjectId format if needed
    const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
    const senderId = String(transaction.senderId?.$oid || transaction.senderId);
    
    // Ensure we only show transactions relevant to the current user
    const isIncoming = receiverId === currentUserId;
    const isOutgoing = senderId === currentUserId;
    
    // Skip transactions not related to current user
    if (!isIncoming && !isOutgoing) {
      console.log(`Skipping transaction not related to current user: ${transaction._id}`);
      return false;
    }
    
    // Apply filter if specified
    if (filter === "all") return true;
    if (filter === "incoming") return isIncoming;
    if (filter === "outgoing") return isOutgoing;
    return true;
  });

  // Only show the latest 5 transactions
  const visibleTransactions = filteredTransactions.slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Function to get transaction display properties
  const getTransactionDisplay = (transaction) => {
    // Process MongoDB ObjectId format if needed
    const receiverId = String(transaction.receiverId?.$oid || transaction.receiverId);
    const senderId = String(transaction.senderId?.$oid || transaction.senderId);
    
    // Check if current user is receiver (incoming) or sender (outgoing)
    const isIncoming = receiverId === currentUserId;
    
    return {
      isIncoming,
      statusColor: transaction.status === "completed" ? "text-green-600" : 
                  transaction.status === "pending" ? "text-amber-500" : "text-red-500",
      amountDisplay: isIncoming ? 
        `+₹${transaction.amount.toLocaleString()}` : 
        `-₹${transaction.amount.toLocaleString()}`,
      amountColor: isIncoming ? "text-green-600" : "text-red-600",
      icon: isIncoming ? <FiArrowDown size={16} /> : <FiArrowUp size={16} />,
      iconBg: isIncoming ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
      party: isIncoming ? 
        formatTranslation(t.from, transaction.senderName || t.unknown) : 
        formatTranslation(t.to, transaction.receiverName || t.unknown),
      description: transaction.note || (isIncoming ? t.receivedPayment : t.sentPayment)
    };
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">{t.title}</h2>
            <p className="text-gray-500 text-sm">
              {userProfile?.name ? `${userProfile.name}${formatTranslation(t.subtitle, visibleTransactions.length)}` : 
                `${t.your}${formatTranslation(t.subtitle, visibleTransactions.length)}`}
            </p>
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
            {t.all}
          </button>
          <button
            onClick={() => setFilter("incoming")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
              filter === "incoming" 
                ? "bg-green-600 text-white" 
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <FiArrowDown className="mr-1" size={14} /> {t.incoming}
          </button>
          <button
            onClick={() => setFilter("outgoing")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
              filter === "outgoing" 
                ? "bg-red-600 text-white" 
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <FiArrowUp className="mr-1" size={14} /> {t.outgoing}
          </button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 overflow-hidden max-h-80">
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
        ) : visibleTransactions.length > 0 ? (
          <div className="space-y-1 overflow-hidden">
            {visibleTransactions.map((transaction) => {
              const {
                isIncoming, statusColor, amountDisplay, amountColor, 
                icon, iconBg, party, description
              } = getTransactionDisplay(transaction);
              
              return (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${iconBg}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{party}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-2">
                      <div className="flex items-center justify-end">
                        <p className={`font-medium ${amountColor}`}>{amountDisplay}</p>
                        {transaction.status === "completed" && (
                          <FiCheckCircle className="ml-1 text-green-500" size={12} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{description}</p>
                    </div>
                    <FiChevronRight className="opacity-0 group-hover:opacity-100 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiClock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">{t.noTransactionsYet}</h3>
            <p className="text-gray-500 text-sm">
              {t.noTransactionsDescription}
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button 
            onClick={() => setShowAllTransactions(true)}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 inline-flex items-center"
          >
            {t.viewAllTransactions} <FiChevronRight className="ml-1" size={16} />
          </button>
        </div>
      </motion.div>

      {/* Pass translations to modal */}
      <AnimatePresence>
        {showAllTransactions && (
          <TransactionModal 
            transactions={transactions} 
            onClose={() => setShowAllTransactions(false)} 
            formatDate={formatDate}
            getTransactionDisplay={getTransactionDisplay}
            currentUserId={currentUserId}
            translations={t}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentTransactions;
