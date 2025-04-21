import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiUsers, FiSearch, FiX, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import Avatar from "react-avatar";
import { useGetUserProfileQuery, useTransferMoneyMutation, useGetAllBankUsersQuery } from "../../state/api";
import { TranslationContext2 } from "../../context/TranslationContext2";

const QuickTransfer = ({ onTransferComplete }) => {
  // Get translations
  const translationContext = useContext(TranslationContext2);
  const { translations } = translationContext || {};
  
  // Use optional chaining to prevent errors when translations are not yet loaded
  const t = translations?.quickTransfer || {
    title: "Quick Transfer",
    subtitle: "Send money to other users instantly",
    searchPlaceholder: "Search users by name or email",
    availableUsers: "Available Users",
    refresh: "Refresh",
    noUsersFound: "No users found matching your search",
    noUsersAvailable: "No other users available for transfer",
    errorPrefix: "Error loading users:",
    createUserHint: "Try creating another user account to test transfers",
    refreshUsersList: "Refresh users list",
    transferMoney: "Transfer Money",
    transferSubtitle: "Send money instantly and securely",
    you: "You",
    amount: "Amount",
    addNote: "Add a note (optional)",
    notePlaceholder: "What's this for?",
    availableBalance: "Available Balance",
    cancel: "Cancel",
    sendMoney: "Send Money",
    processing: "Processing...",
    enterValidAmount: "Please enter a valid amount",
    insufficientBalance: "Insufficient balance",
    transferFailed: "Transfer failed. Please try again."
  };

  const { data: profileData } = useGetUserProfileQuery();
  const { data: usersData, isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = useGetAllBankUsersQuery();
  const [transferMoney, { isLoading: isTransferring }] = useTransferMoneyMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [validationError, setValidationError] = useState("");
  const [quickAmounts] = useState([500, 1000, 2000, 5000]);
  const [manualUsers, setManualUsers] = useState([]);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isManualFetching, setIsManualFetching] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsManualFetching(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token available!");
          setDebugMessage('No token available');
          return;
        }

        console.log("Manually fetching users...");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:9000'}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log("Manual fetch response:", data);
        
        if (data.success && data.users) {
          console.log("Manual fetch successful, found", data.users.length, "users");
          setManualUsers(data.users);
          setDebugMessage(`Found ${data.users.length} users via manual fetch`);
        } else {
          console.error("Failed to get users from manual fetch:", data);
          setDebugMessage(`Failed to get users: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        console.error("Manual fetch error:", err);
        setDebugMessage(`Error fetching users: ${err.message}`);
      } finally {
        setFetchAttempted(true);
        setIsManualFetching(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (usersData) {
      console.log("RTK Query users data:", usersData);
      if (usersData.users) {
        console.log(`Found ${usersData.users.length} users via RTK Query`);
        setDebugMessage(prev => `${prev}\nFound ${usersData.users.length} users via RTK Query`);
      } else if (Array.isArray(usersData)) {
        console.log(`Found ${usersData.length} users via RTK Query (array format)`);
        setDebugMessage(prev => `${prev}\nFound ${usersData.length} users via RTK Query (array)`);
      }
    }
  }, [usersData]);

  useEffect(() => {
    console.log("Current profile data:", profileData);
    if (profileData?.user) {
      console.log("Current user ID:", profileData.user.id || profileData.user._id);
      setDebugMessage(prev => `${prev}\nCurrent user ID: ${profileData.user.id || profileData.user._id}`);
    }
  }, [profileData]);

  const getUsersList = () => {
    // Check if RTK Query returned users in users property 
    if (usersData?.users && usersData.users.length > 0) {
      return usersData.users;
    }
    
    // Check if RTK Query returned users as an array directly
    if (usersData && Array.isArray(usersData) && usersData.length > 0) {
      return usersData;
    }
    
    // Otherwise use manually fetched users
    if (manualUsers && manualUsers.length > 0) {
      return manualUsers;
    }
    
    return [];
  };

  const getCurrentUserId = () => {
    // Use the id from profileData if available
    if (profileData?.user?.id) return profileData.user.id;
    
    // Alternatively, use _id which might be used instead
    if (profileData?.user?._id) return profileData.user._id;
    
    // If user ID is stored in localStorage, use that as a fallback
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) return userIdFromStorage;
    
    // If no user ID is available, return null
    return null;
  };

  const filteredUsers = getUsersList().filter(user => {
    const currentUserId = getCurrentUserId();
    
    // For debugging
    if (user._id === currentUserId || user.id === currentUserId) {
      console.log("Filtering out current user:", user.name, user._id || user.id);
    }
    
    // Skip user if it's the current logged-in user (check both _id and id formats)
    if (currentUserId && (user._id === currentUserId || user.id === currentUserId)) {
      return false;
    }
    
    // Include users matching search term if search is active
    if (searchTerm) {
      return (
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Include all users that aren't the current user
    return true;
  });

  // Log filtered users count for debugging
  useEffect(() => {
    if (profileData && getUsersList().length > 0) {
      console.log(`Total users: ${getUsersList().length}, Filtered users: ${filteredUsers.length}`);
      console.log("Current user ID:", getCurrentUserId());
    }
  }, [profileData, usersData, manualUsers, searchTerm]);

  const frequentUsers = filteredUsers.slice(0, 5);

  const handleTransfer = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      setValidationError(t.enterValidAmount);
      return;
    }
    
    if (amountValue > profileData?.user?.bankBalance) {
      setValidationError(t.insufficientBalance);
      return;
    }

    try {
      const result = await transferMoney({
        receiverId: selectedUser._id,
        amount: amountValue,
        note: note || "Quick transfer"
      }).unwrap();
      
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setShowTransferModal(false);
      
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setValidationError(error.data?.message || error.message || t.transferFailed);
    }
  };

  const selectQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const forceRefreshUsers = () => {
    refetchUsers();
    const fetchUsers = async () => {
      try {
        setIsManualFetching(true);
        setDebugMessage('Manually refreshing users...');
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token available!");
          return;
        }

        console.log("Manually fetching users...");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:9000'}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Add cache busting param
          cache: 'no-cache'
        });
        
        const data = await response.json();
        
        if (data.success && data.users) {
          console.log("Refresh successful, found", data.users.length, "users");
          setManualUsers(data.users);
          setDebugMessage(`Refresh successful. Found ${data.users.length} users`);
        } else {
          console.error("Failed to refresh users:", data);
          setDebugMessage(`Failed to refresh: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        console.error("Force refresh error:", err);
        setDebugMessage(`Refresh error: ${err.message}`);
      } finally {
        setIsManualFetching(false);
      }
    };
    fetchUsers();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">{t.title}</h2>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiSend className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="mb-6 relative">
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FiUsers className="text-gray-500" />
            <h3 className="text-sm font-medium text-gray-600">{t.availableUsers}</h3>
            <button 
              onClick={forceRefreshUsers}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 flex items-center"
            >
              {t.refresh} <FiArrowRight className="ml-1" size={12} />
            </button>
          </div>
          
          {(isLoadingUsers || isManualFetching) ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : frequentUsers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {frequentUsers.map((user) => (
                <motion.button
                  key={user._id || user.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowTransferModal(true);
                  }}
                >
                  <Avatar
                    name={user.name || "User"}
                    size="50"
                    round={true}
                    className="mb-1 border-2 border-white shadow-sm"
                  />
                  <span className="text-xs font-medium text-gray-700 w-16 text-center truncate">
                    {user.name?.split(' ')[0] || "User"}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-6 bg-gray-50 rounded-lg">
              <FiAlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm text-gray-500">
                {searchTerm 
                  ? t.noUsersFound 
                  : t.noUsersAvailable}
              </p>
              <div className="mt-3 text-xs text-gray-400">
                {usersError ? (
                  <p className="text-red-500">{t.errorPrefix} {JSON.stringify(usersError)}</p>
                ) : (
                  <p>{t.createUserHint}</p>
                )}
              </div>
              <button 
                onClick={forceRefreshUsers}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                {t.refreshUsersList}
              </button>
              
              {/* Debug information - can be removed in production */}
              {debugMessage && (
                <div className="mt-4 p-2 bg-gray-100 text-left text-xs text-gray-600 overflow-auto max-h-40 rounded">
                  <pre>{debugMessage}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showTransferModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
                <h3 className="text-xl font-bold mb-1">{t.transferMoney}</h3>
                <p className="opacity-90">{t.transferSubtitle}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex flex-col items-center">
                    <Avatar
                      name={profileData?.user?.name || t.you}
                      size="50"
                      round={true}
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="mt-1 text-sm font-medium">{t.you}</span>
                  </div>
                  
                  <div className="mx-4 bg-gray-100 h-1 w-16 rounded-full relative">
                    <FiArrowRight 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-600"
                      size={24}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Avatar
                      name={selectedUser.name}
                      size="50"
                      round={true}
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="mt-1 text-sm font-medium">{selectedUser.name}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.amount}</label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-gray-300 pl-10 pr-12 py-3 focus:border-blue-500 focus:ring-blue-500 text-lg font-medium"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setValidationError("");
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg py-2"
                        onClick={() => selectQuickAmount(quickAmount)}
                      >
                        ₹{quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.addNote}</label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t.notePlaceholder}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {validationError && (
                  <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                    {validationError}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.availableBalance}</span>
                    <span className="font-medium">₹{profileData?.user?.bankBalance?.toLocaleString() || 0}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    onClick={() => setShowTransferModal(false)}
                  >
                    {t.cancel}
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex justify-center items-center"
                    onClick={handleTransfer}
                    disabled={isTransferring}
                  >
                    {isTransferring ? (
                      <span className="animate-pulse">{t.processing}</span>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> {t.sendMoney}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickTransfer;
