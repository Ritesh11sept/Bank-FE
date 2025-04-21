import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, CreditCard, IndianRupee, BarChart2, Clock, Layers, ArrowRight, Check, MessageSquare } from 'lucide-react';
import PricingSection from './PricingSection';
import StockNews from './StockNews';
import Footer from './Footer';
import AboutModal from './About';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Chatbot from '../../chatbot';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../context/TranslationContext';

const NavButton = ({ children, variant = 'secondary', href, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 ${
      variant === 'primary' 
        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-lg hover:scale-105' 
        : 'text-emerald-400 hover:bg-emerald-400/10 hover:scale-105 backdrop-blur-sm'
    }`}
  >
    {children}
  </button>
);

const CurrencyInput = ({ currency, amount, setCurrency }) => (
  <div className="flex items-center gap-2 w-full p-4 rounded-xl bg-white">
    <button 
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50"
      onClick={() => setCurrency(prev => prev === 'INR' ? 'USD' : 'INR')}
    >
      <img 
        src={`/api/placeholder/24/24`}
        alt={currency}
        className="w-6 h-6 rounded-full"
      />
      <span className="font-medium">{currency}</span>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <input 
      type="text" 
      value={amount}
      className="flex-1 text-right outline-none text-lg font-medium"
      placeholder="0.00"
    />
  </div>
);

const StatsCard = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      {trend && (
        <span className={`px-2 py-1 rounded-full text-sm ${
          trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center text-center transition-transform hover:scale-105">
    <div className="bg-emerald-600 p-3 rounded-full mb-4">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const PricingCard = ({ title, description, price, features, isPopular }) => (
  <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-3xl relative">
    <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="mb-6">
      <span className="text-4xl font-bold text-white">₹{price}</span>
      <span className="text-gray-400 text-sm ml-1">/per month</span>
    </div>
    
    <div className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center">
          <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{feature}</span>
        </div>
      ))}
    </div>
    
    <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors">
      Select This Plan
    </button>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('INR');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const newsRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { translations } = useTranslation();

  const features = [
    {
      icon: Layers,
      title: translations.featureList.panIntegration.title,
      description: translations.featureList.panIntegration.description
    },
    {
      icon: BarChart2,
      title: translations.featureList.smartAnalytics.title,
      description: translations.featureList.smartAnalytics.description
    },
    {
      icon: IndianRupee,
      title: translations.featureList.financialGoals.title,
      description: translations.featureList.financialGoals.description
    },
    {
      icon: Smartphone,
      title: translations.featureList.marketInsights.title,
      description: translations.featureList.marketInsights.description
    },
    {
      icon: CreditCard,
      title: translations.featureList.rewardsSystem.title,
      description: translations.featureList.rewardsSystem.description
    },
    {
      icon: Clock,
      title: translations.featureList.realTimeMonitoring.title,
      description: translations.featureList.realTimeMonitoring.description
    }
  ];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavigation = (path) => {
    switch(path) {
      case '/about':
        setIsAboutOpen(true);
        break;
      case '/features':
        scrollToSection(featuresRef);
        break;
      case '/pricing':
        scrollToSection(pricingRef);
        break;
      case '/news':
        scrollToSection(newsRef);
        break;
      case '/signup':
        setIsRegisterOpen(true);
        break;
      case '/landing':
        setIsLoginOpen(true);
        break;
      default:
        navigate(path);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="min-h-screen relative">
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      
      {/* Language Selector Popup */}
      <LanguageSelector />
      
      {/* Header */}
      <Header 
        onNavigate={handleNavigation}
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      {/* Main Content */}
      <main>
        {/* Enhanced Hero Section with Background */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url("/background.jpg")',
                filter: 'brightness(0.7)'
              }}
            />
            <div className="absolute inset-0 " />
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm mb-4 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-medium">
                  {translations.hero.newBadge}
                </span>
                {translations.hero.upiEnabled}
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {translations.hero.title}
              </motion.h1>
              
              <motion.p 
                className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {translations.hero.description}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {translations.hero.startBanking} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
                >
                  {translations.hero.loginToAccount}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
          </motion.div>
        </div>

        <div className="bg-white">
          {/* Replace Stats Grid Section with StockNews */}
          <div ref={newsRef} className="max-w-6xl mx-auto px-6 scroll-mt-24">
            <StockNews />
          </div>

          {/* Features Section */}
          <div ref={featuresRef} className="py-24 border-t border-gray-100 scroll-mt-24">
            <div className="text-center mb-16">
              <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                {translations.features.title}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {translations.features.heading}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {translations.features.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div ref={pricingRef} className="scroll-mt-24">
            <PricingSection />
          </div>
        </div>
      </main>

      <LoginModal 
        open={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      {/* Updated Chatbot button with translations */}
      {!showChatbot && (
        <button 
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 hover:shadow-2xl transition-all flex items-center justify-center z-[9999]"
          aria-label={translations.chatbot.label}
          style={{ transform: 'translateZ(0)' }}
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      )}
      
      {/* Chatbot container */}
      {showChatbot && (
        <div className="fixed bottom-0 right-0 z-[9999] w-[400px] h-[70vh] m-6" 
             style={{ transform: 'translateZ(0)' }}>
          <Chatbot 
            onClose={toggleChatbot} 
            containerClass="w-full h-full shadow-2xl" 
          />
        </div>
      )}

      {/* Add Footer at the bottom */}
      <Footer />
      
    </div>
  );
};

export default HomePage;