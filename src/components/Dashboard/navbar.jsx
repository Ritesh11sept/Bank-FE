import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiMail, FiUser, FiLogOut, FiHelpCircle, FiMenu, FiCreditCard, FiFileText, FiShield } from "react-icons/fi";
import Avatar from "react-avatar";

// Change props to destructure both toggleSidebar and setMobileOpen
const Navbar = ({ toggleSidebar, setMobileOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
  const openAccountModal = () => {
    setIsProfileMenuOpen(false); // Close the profile menu
    setShowAccountModal(true); // Open the account modal
  };

  const toggleAccountSwitcher = () => {
    setShowAccountSwitcher(!showAccountSwitcher);
  };

  // Let's simplify this and use a more direct approach
  const handleSidebarToggle = () => {
    console.log("Direct sidebar toggle");
    // Call the parent's setMobileOpen function directly with a hardcoded value
    if (typeof setMobileOpen === 'function') {
      setMobileOpen(true); // Always open the sidebar on click
      console.log("Sidebar should be open now");
    } else {
      console.error("setMobileOpen is not available:", setMobileOpen);
    }
  };

  const notificationItems = [
    { icon: <FiBell size={20} />, count: 4, label: "Notifications" },
    { icon: <FiMail size={20} />, count: 2, label: "Messages" },
  ];

  const accountInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    accountNumber: "XXXX-XXXX-1234",
    accountType: "Savings",
    panNumber: "ABCDE1234F",
    branch: "Main Branch - Mumbai",
    ifsc: "BANK0001234",
    lastLogin: "Today, 10:45 AM",
    phone: "+91 98765 43210"
  };
  
  const accountsList = [
    { accountNumber: "XXXX-XXXX-1234", accountType: "Savings", isPrimary: true },
    { accountNumber: "XXXX-XXXX-5678", accountType: "Current", isPrimary: false },
    { accountNumber: "XXXX-XXXX-9012", accountType: "Fixed Deposit", isPrimary: false }
  ];

  const profileMenuItems = [
    { icon: <FiUser size={16} />, text: "Profile", action: openAccountModal },
    { icon: <FiLogOut size={16} />, text: "Sign Out", action: () => console.log("Sign out clicked") },
  ];

  return (
    <>
      <nav className="fixed top-0 right-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm lg:ml-64 w-full lg:w-[calc(100%-16rem)]">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* Left section with hamburger and logo */}
          <div className="flex items-center">
            {/* Hamburger menu for mobile */}
            <button
              onClick={handleSidebarToggle}
              className="lg:hidden mr-3 p-2.5 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl transition-all duration-200 border border-gray-100 hover:border-emerald-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={22} />
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            {/* Notification icons */}
            {notificationItems.map((item, index) => (
              <div key={index} className="relative hidden sm:block">
                <button
                  className="p-2.5 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl transition-all duration-200 border border-gray-100 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 active:scale-95"
                  aria-label={item.label}
                >
                  {item.icon}
                  {item.count > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm font-medium">
                      {item.count}
                    </span>
                  )}
                </button>
              </div>
            ))}
            
            {/* Profile menu */}
            <div className="relative ml-1">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileMenu}
                className="hover:shadow-[0_0_0_2px_rgba(16,185,129,0.3)] transition-all rounded-full flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-300 active:scale-95"
                aria-label="Profile menu"
              >
                <Avatar
                  name={accountInfo.name}
                  size="40"
                  round={true}
                  color="#10B981"
                  className="border-2 border-emerald-500"
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    ref={profileMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 bg-white shadow-lg rounded-xl py-2 w-72 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          name={accountInfo.name}
                          size="40"
                          round={true}
                          color="#10B981"
                          className="border-2 border-emerald-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{accountInfo.name}</p>
                          <p className="text-sm text-gray-500 truncate">{accountInfo.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Primary Account</span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {accountInfo.accountType}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{accountInfo.accountNumber}</p>
                      </div>
                      
                      <div className="mt-2 flex justify-between text-xs">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">PAN:</span>
                          <span className="font-medium">{accountInfo.panNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">KYC:</span>
                          <span className="text-emerald-600 font-medium flex items-center">
                            <FiShield size={10} className="mr-0.5" /> {accountInfo.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors
                          ${index === profileMenuItems.length - 1 ? 'text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100' : ''}`}
                      >
                        <span className={`${index === profileMenuItems.length - 1 ? 'text-red-500' : 'text-gray-400'}`}>
                          {item.icon}
                        </span>
                        {item.text}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Account Details Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAccountModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={accountInfo.name}
                    size="56"
                    round={true}
                    color="#10B981"
                    className="border-2 border-white shadow-md"
                  />
                  <div className="text-white">
                    <h3 className="font-bold text-xl">{accountInfo.name}</h3>
                    <p className="opacity-90 text-sm">{accountInfo.email}</p>
                    <p className="opacity-90 text-sm">{accountInfo.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Account Details */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">Account Information</h4>
                  <div className="relative">
                    <button 
                      onClick={toggleAccountSwitcher}
                      className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      Switch Account
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showAccountSwitcher ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {showAccountSwitcher && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg w-64 overflow-hidden z-10 border border-gray-200"
                        >
                          {accountsList.map((account, idx) => (
                            <button 
                              key={idx}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Switching to account: ${account.accountNumber}`);
                                setShowAccountSwitcher(false);
                              }}
                            >
                              <div>
                                <div className="text-sm font-medium">{account.accountNumber}</div>
                                <div className="text-xs text-gray-500">{account.accountType}</div>
                              </div>
                              {account.isPrimary && (
                                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Primary</span>
                              )}
                            </button>
                          ))}
                          
                          <div className="border-t border-gray-200 p-2">
                            <button 
                              className="w-full text-sm text-center py-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Manage accounts clicked");
                                setShowAccountSwitcher(false);
                              }}
                            >
                              Manage Accounts
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Current Account</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                      {accountInfo.accountType}
                    </span>
                  </div>
                  
                <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account Number</span>
                      <span className="text-sm font-medium">{accountInfo.accountNumber}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IFSC Code</span>
                      <span className="text-sm font-medium">{accountInfo.ifsc}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Branch</span>
                      <span className="text-sm font-medium">{accountInfo.branch}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">PAN Number</span>
                    <span className="text-sm font-medium">{accountInfo.panNumber}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">KYC Status</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center">
                      <FiShield size={14} className="mr-1" /> {accountInfo.kycStatus}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-500 block">Last Login</span>
                    <span className="text-sm font-medium">{accountInfo.lastLogin}</span>
                  </div>
                  <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors duration-200">
                    View Activity
                  </button>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button 
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200 font-medium flex items-center gap-2"
                    onClick={() => console.log("Manage accounts clicked")}
                  >
                    <FiCreditCard size={16} />
                    Manage Accounts
                  </button>
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;