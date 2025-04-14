import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiUsers, FiSearch, FiX, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import Avatar from "react-avatar";
import { useGetUserProfileQuery, useTransferMoneyMutation, useGetAllBankUsersQuery } from "../../state/api";

const QuickTransfer = ({ onTransferComplete }) => {
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

  // Manual fetch for users to test auth token
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token available!");
          return;
        }

        console.log("Starting manual fetch with token:", token.substring(0, 15) + "...");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:9000'}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Manual fetch response status:", response.status);
        const data = await response.json();
        console.log("Manual fetch response data:", data);
        
        if (data.success && data.users) {
          setManualUsers(data.users);
          console.log(`Found ${data.users.length} users via manual fetch`);
        } else {
          console.error("Failed to get users from manual fetch:", data);
        }
      } catch (err) {
        console.error("Manual fetch error:", err);
      } finally {
        setFetchAttempted(true);
      }
    };

    fetchUsers();
  }, []);

  // Log diagnostic info about the RTK Query fetch
  useEffect(() => {
    console.log("RTK Query users data:", usersData);
    console.log("RTK Query loading state:", isLoadingUsers);
    console.log("RTK Query error:", usersError);
    
    // If we get users data, log the count
    if (usersData?.users) {
      console.log(`Found ${usersData.users.length} users via RTK Query`);
    }
  }, [usersData, isLoadingUsers, usersError]);

  // Get filtered users, trying both RTK query and manual fetch
  const getUsersList = () => {
    // First try RTK query results
    if (usersData?.users && usersData.users.length > 0) {
      console.log("Using RTK Query users");
      return usersData.users;
    }
    
    // Fall back to manual fetch results
    if (manualUsers.length > 0) {
      console.log("Using manually fetched users");
      return manualUsers;
    }
    
    // If both empty, return empty array
    console.log("No users found from either method");
    return [];
  };

  // Filter users
  const filteredUsers = getUsersList()
    .filter(user => user._id !== profileData?.user?.id)
    .filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get frequent transfers as the first 5 filtered users
  const frequentUsers = filteredUsers.slice(0, 5);

  const handleTransfer = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      setValidationError("Please enter a valid amount");
      return;
    }
    
    if (amountValue > profileData?.user?.bankBalance) {
      setValidationError("Insufficient balance");
      return;
    }

    try {
      console.log("Starting transfer to:", selectedUser);
      console.log("Transfer amount:", amountValue);
      
      // Wrap in try-catch with more detailed error logging
      try {
        const result = await transferMoney({
          receiverId: selectedUser._id,
          amount: amountValue,
          note: note || "Quick transfer"
        }).unwrap();
        
        console.log("Transfer result:", result);
      } catch (apiError) {
        console.error("API Error details:", apiError);
        // Check if it's the invalidatesTags error
        if (apiError instanceof TypeError && apiError.message.includes("invalidatesTags")) {
          console.error("This is the invalidatesTags error in the Redux toolkit. Using fallback...");
          
          // Fallback: direct API call
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:9000'}/user/transfer`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              receiverId: selectedUser._id,
              amount: amountValue,
              note: note || "Quick transfer"
            })
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.message || "Transfer failed");
          }
          
          console.log("Transfer result from fallback:", result);
        } else {
          throw apiError; // Re-throw if it's not the specific error we're handling
        }
      }
      
      // Reset fields
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setShowTransferModal(false);
      
      // Notify parent component to refresh data
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setValidationError(error.data?.message || error.message || "Transfer failed. Please try again.");
    }
  };

  const selectQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  // Function to force refresh users
  const forceRefreshUsers = () => {
    refetchUsers();
    // Also try manual fetch again
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token available!");
          return;
        }

        console.log("Force refreshing users with token:", token.substring(0, 15) + "...");
        const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:9000'}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log("Force refresh response:", data);
        
        if (data.success && data.users) {
          setManualUsers(data.users);
          console.log(`Found ${data.users.length} users via force refresh`);
        }
      } catch (err) {
        console.error("Force refresh error:", err);
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
            <h2 className="text-xl font-bold mb-1">Quick Transfer</h2>
            <p className="text-gray-500 text-sm">Send money to other users instantly</p>
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
              placeholder="Search users by name or email"
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
            <h3 className="text-sm font-medium text-gray-600">Available Users</h3>
            <button 
              onClick={forceRefreshUsers}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 flex items-center"
            >
              Refresh <FiArrowRight className="ml-1" size={12} />
            </button>
          </div>
          
          {isLoadingUsers && !fetchAttempted ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : frequentUsers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {frequentUsers.map((user) => (
                <motion.button
                  key={user._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    console.log("Selected user for transfer:", user);
                    setSelectedUser(user);
                    setShowTransferModal(true);
                  }}
                >
                  <Avatar
                    name={user.name}
                    size="50"
                    round={true}
                    className="mb-1 border-2 border-white shadow-sm"
                  />
                  <span className="text-xs font-medium text-gray-700 w-16 text-center truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-6 bg-gray-50 rounded-lg">
              <FiAlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm text-gray-500">
                {searchTerm 
                  ? "No users found matching your search" 
                  : "No other users available for transfer"}
              </p>
              <div className="mt-3 text-xs text-gray-400">
                {usersError ? (
                  <p className="text-red-500">Error loading users: {JSON.stringify(usersError)}</p>
                ) : (
                  <p>Try creating another user account to test transfers</p>
                )}
              </div>
              <button 
                onClick={forceRefreshUsers}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Refresh users list
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transfer Modal */}
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
                <h3 className="text-xl font-bold mb-1">Transfer Money</h3>
                <p className="opacity-90">Send money instantly and securely</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex flex-col items-center">
                    <Avatar
                      name={profileData?.user?.name || "You"}
                      size="50"
                      round={true}
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="mt-1 text-sm font-medium">You</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add a note (optional)</label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="What's this for?"
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
                    <span className="text-gray-600">Available Balance</span>
                    <span className="font-medium">₹{profileData?.user?.bankBalance?.toLocaleString() || 0}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    onClick={() => setShowTransferModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex justify-center items-center"
                    onClick={handleTransfer}
                    disabled={isTransferring}
                  >
                    {isTransferring ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Send Money
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
