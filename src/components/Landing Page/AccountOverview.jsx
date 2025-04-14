import { motion } from "framer-motion";
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiCreditCard } from "react-icons/fi";
import { useGetUserProfileQuery, useGetUserTransactionsQuery } from "../../state/api";

const AccountOverview = ({ balance }) => {
  const { data: profileData } = useGetUserProfileQuery();
  const { data: transactionsData } = useGetUserTransactionsQuery();
  
  const userData = profileData?.user || {};
  const transactions = transactionsData?.transactions || [];
  
  // Calculate money in/out totals for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTransactions = transactions.filter(
    transaction => new Date(transaction.date) >= thirtyDaysAgo
  );
  
  const moneyIn = recentTransactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const moneyOut = recentTransactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Account info
  const accountInfo = {
    accountNumber: userData?.linkedAccounts?.[0]?.accountNumber || "XXXX-XXXX-0000",
    accountType: "Savings Account",
    bank: userData?.linkedAccounts?.[0]?.bankName || "Bank Name",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Account Overview</h2>
          <p className="text-gray-500 text-sm">Your current balance and account details</p>
        </div>
        <div className="p-2 bg-emerald-100 rounded-lg">
          <FiDollarSign className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Available Balance</p>
              <h3 className="text-3xl font-bold">₹{balance.toLocaleString()}</h3>
            </div>
            <div className="flex space-x-1">
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                <FiCreditCard className="mr-1" size={14} />
                {accountInfo.accountType}
              </span>
            </div>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-emerald-100">Account Number</span>
              <span className="font-medium">{accountInfo.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Bank</span>
              <span className="font-medium">{accountInfo.bank}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-700">Money In</h4>
              <div className="p-1.5 bg-green-100 rounded-full">
                <FiArrowDownRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{moneyIn.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-700">Money Out</h4>
              <div className="p-1.5 bg-red-100 rounded-full">
                <FiArrowUpRight className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{moneyOut.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountOverview;
