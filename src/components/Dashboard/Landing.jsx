import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";
import AccountOverview from "../Landing Page/AccountOverview";
import QuickTransfer from "../Landing Page/QuickTransfer";
import RecentTransactions from "../Landing Page/RecentTransactions";
import FinancialTips from "../Landing Page/FinancialTips";
import { useGetUserProfileQuery } from "../../state/api";

const Landing = () => {
  const { data: profileData, refetch: refetchProfile, isLoading: profileLoading } = useGetUserProfileQuery();
  const [balance, setBalance] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  
  // Check if token is available
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Auth token available:", !!token);
    if (token) {
      setTokenAvailable(true);
    } else {
      console.error("No authentication token found!");
    }
  }, []);
  
  useEffect(() => {
    if (profileData?.user?.bankBalance) {
      setBalance(profileData.user.bankBalance);
      console.log("User profile loaded, balance:", profileData.user.bankBalance);
    }
  }, [profileData]);
  
  const handleTransferComplete = () => {
    // Refetch user profile to get updated balance
    console.log("Transfer completed, refreshing profile...");
    refetchProfile();
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!tokenAvailable) {
    return (
      <div className="flex min-h-screen bg-gray-50 justify-center items-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your dashboard. No authentication token was found.
          </p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar setMobileOpen={setMobileOpen} />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-grow p-3 sm:ml-60 mt-16 bg-gray-50">
        <div className="container mx-auto max-w-[1400px]">
          <div className="py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                  <AccountOverview balance={balance} />
                  <QuickTransfer onTransferComplete={handleTransferComplete} />
                  <RecentTransactions />
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  <FinancialTips />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
