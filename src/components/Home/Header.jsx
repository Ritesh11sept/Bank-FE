import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NavButton = ({ children, variant = 'secondary', onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 sm:px-6 md:px-8 py-2 md:py-3 text-base font-semibold rounded-full transition-all duration-300 ${
      variant === 'primary' 
        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-lg hover:scale-105' 
        : 'text-emerald-400 hover:bg-emerald-400/10 hover:scale-105 backdrop-blur-sm'
    }`}
  >
    {children}
  </button>
);

const Header = ({ onNavigate, onLoginClick, onRegisterClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="px-4 lg:px-8 py-4 lg:py-6 fixed w-full top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">₹</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">FinanceSeer</span>
            <span className="text-xs lg:text-sm text-emerald-400">Smart Financial Insights</span>
          </div>
        </motion.div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-white rounded-md hover:bg-white/10"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <NavButton onClick={() => handleNavigation('/about')}>About</NavButton>
            <NavButton onClick={() => handleNavigation('/features')}>Features</NavButton>
            <NavButton onClick={() => handleNavigation('/pricing')}>Pricing</NavButton>
            <NavButton onClick={() => handleNavigation('/news')}>News</NavButton>
          </div>
          <div className="flex items-center gap-4 ml-4 before:content-[''] before:w-px before:h-8 before:bg-white/10">
            <NavButton onClick={onLoginClick}>Sign in</NavButton>
            <NavButton variant="primary" onClick={onRegisterClick}>
              Get Started
            </NavButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden mt-4 pb-4"
        >
          <div className="flex flex-col gap-4">
            <NavButton onClick={() => handleNavigation('/about')}>About</NavButton>
            <NavButton onClick={() => handleNavigation('/features')}>Features</NavButton>
            <NavButton onClick={() => handleNavigation('/pricing')}>Pricing</NavButton>
            <NavButton onClick={() => handleNavigation('/news')}>News</NavButton>
            <div className="h-px bg-white/10 my-2"></div>
            <NavButton onClick={onLoginClick}>Sign in</NavButton>
            <NavButton variant="primary" onClick={onRegisterClick}>
              Get Started
            </NavButton>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Header;
