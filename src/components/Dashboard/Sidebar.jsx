import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
// Import icons from a React Icons package like react-icons instead of MUI
import { FaHome, FaChartLine, FaLightbulb, FaGem, FaPiggyBank, FaChartBar, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <FaHome className="w-5 h-5" />, path: '/landing' },
    { text: 'Markets', icon: <FaChartLine className="w-5 h-5" />, path: '/markets' },
    { text: 'Prediction', icon: <FaLightbulb className="w-5 h-5" />, path: '/predictions' },
    { text: 'Treasures', icon: <FaGem className="w-5 h-5" />, path: '/treasures' },
    { text: 'Savings', icon: <FaPiggyBank className="w-5 h-5" />, path: '/savings' },
    { text: 'Analytics', icon: <FaChartBar className="w-5 h-5" />, path: '/dashboard' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const bottomMenuItems = [
    { text: 'Help', icon: <FaQuestionCircle className="w-5 h-5" />, path: '/help' },
    { text: 'Logout', icon: <FaSignOutAlt className="w-5 h-5" />, onClick: handleLogout },
  ];

  const DrawerContent = () => (
    <div className="h-full pt-16 flex flex-col border-r border-gray-200 bg-white/90 backdrop-blur-xl">
      <nav className="px-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full my-2 px-4 py-2 flex items-center rounded-lg transition-all duration-200 hover:bg-emerald-50 hover:translate-x-2
                ${location.pathname === item.path ? 'bg-emerald-50 text-emerald-500' : 'text-gray-600'}`}
            >
              <span className={`mr-4 ${location.pathname === item.path ? 'text-emerald-500' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className={`${location.pathname === item.path ? 'font-semibold' : ''}`}>
                {item.text}
              </span>
            </button>
          </motion.div>
        ))}
      </nav>

      <div className="h-px bg-gray-200 my-4" />

      <nav className="px-4 mt-auto mb-4">
        {bottomMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: (menuItems.length + index) * 0.1 }}
          >
            <button
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  navigate(item.path);
                }
                setMobileOpen(false);
              }}
              className="w-full my-2 px-4 py-2 flex items-center rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              <span className="mr-4 text-gray-400">{item.icon}</span>
              <span>{item.text}</span>
            </button>
          </motion.div>
        ))}
      </nav>
    </div>
  );

  return (
    <nav className="w-60 flex-shrink-0 fixed z-20">
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden
        ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className={`fixed inset-y-0 left-0 w-60 bg-white transform transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <DrawerContent />
        </div>
      </div>

      {/* Desktop Drawer */}
      <div className="hidden lg:block h-full">
        <div className="w-60 h-full shadow-lg">
          <DrawerContent />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
