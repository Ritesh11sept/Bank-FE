import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaChartLine, FaLightbulb, FaGem, FaPiggyBank, FaChartBar, FaQuestionCircle, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import Settings from './Settings';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileOpen]);

  const menuItems = [
    { text: 'Home', icon: <FaHome className="w-5 h-5" />, path: '/landing' },
    { text: 'Markets', icon: <FaChartLine className="w-5 h-5" />, path: '/markets' },
    { text: 'Prediction', icon: <FaLightbulb className="w-5 h-5" />, path: '/predictions' },
    { text: 'Treasures', icon: <FaGem className="w-5 h-5" />, path: '/treasures' },
    { text: 'Savings', icon: <FaPiggyBank className="w-5 h-5" />, path: '/savings' },
    { text: 'Analytics', icon: <FaChartBar className="w-5 h-5" />, path: '/dashboard' },
  ];

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    setMobileOpen(false);
  }, [navigate, setMobileOpen]);

  const bottomMenuItems = [
    { text: 'Settings', icon: <FaCog className="w-5 h-5" />, onClick: () => setShowSettings(true) },
    { text: 'Help', icon: <FaQuestionCircle className="w-5 h-5" />, path: '/help' },
    { text: 'Logout', icon: <FaSignOutAlt className="w-5 h-5" />, onClick: handleLogout },
  ];

  const SidebarContent = memo(() => (
    <div className="h-full flex flex-col bg-white shadow-lg">
      {/* Brand/Logo Area */}
      <div className="flex items-center justify-between py-5 px-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">Finance App</span>
        </div>
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => handleNavigation(item.path)}
              className={`w-full px-4 py-3 flex items-center rounded-xl transition-all duration-200 
                ${location.pathname === item.path 
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'}`}
            >
              <span className={`mr-3 ${location.pathname === item.path ? 'text-emerald-500' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className={`${location.pathname === item.path ? 'font-medium' : ''}`}>
                {item.text}
              </span>
              {location.pathname === item.path && (
                <div className="ml-auto w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-4">
        {bottomMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: (menuItems.length + index) * 0.05 }}
          >
            <button
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  handleNavigation(item.path);
                }
              }}
              className="w-full my-1 px-4 py-3 flex items-center rounded-xl transition-all duration-200 
                text-gray-600 hover:bg-gray-50 hover:translate-x-1"
            >
              <span className="mr-3 text-gray-400">{item.icon}</span>
              <span>{item.text}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      {/* Mobile Hamburger Button - Remove this as it's now in Navbar */}
      
      {/* Mobile Sidebar with Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-20">
        <SidebarContent />
      </div>

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default memo(Sidebar);