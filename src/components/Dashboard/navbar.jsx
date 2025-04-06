import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBell, FiMail, FiSettings } from "react-icons/fi";
import Avatar from "react-avatar";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg">
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-[35px] h-[35px] rounded-md bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center"
            >
              <span className="text-white font-bold">F</span>
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-br from-[#10B981] to-[#059669] bg-clip-text text-transparent">
              Finanseer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {[
            { icon: <FiSearch size={20} />, count: 0 },
            { icon: <FiBell size={20} />, count: 4 },
            { icon: <FiMail size={20} />, count: 2 },
            { icon: <FiSettings size={20} />, count: 0 },
          ].map((item, index) => (
            <button
              key={index}
              className="relative p-2 text-gray-600 hover:bg-emerald-50 rounded-full transition-colors"
            >
              {item.icon}
              {item.count > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={handleProfileClick}
            className="hover:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] transition-shadow rounded-full"
          >
            <Avatar
              name="User Name"
              size="35"
              round={true}
              color="#10B981"
              className="border-2 border-[#10B981]"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md py-2 min-w-[200px] border border-gray-100">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">Profile</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">Settings</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
