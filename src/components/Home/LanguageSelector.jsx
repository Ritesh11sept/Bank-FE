import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';
import { Check, Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { translations, language, changeLanguage, showLanguageModal } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(language); // Track selection separately
  
  if (!showLanguageModal) return null;

  const handleChangeLanguage = () => {
    changeLanguage(selectedLang);
  };

  // Language symbols instead of flags
  const languageSymbols = {
    english: (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md text-white font-bold text-2xl">
        En
      </div>
    ),
    hindi: (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md text-white font-bold text-2xl">
        हि
      </div>
    )
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[9999]">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 w-11/12 max-w-md shadow-2xl border border-gray-100 dark:border-slate-700"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
            <Globe className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">
          {translations.languageSelector.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          {translations.languageSelector.description}
        </p>
        
        <div className="grid grid-cols-2 gap-5 mb-8">
          <motion.button 
            onClick={() => setSelectedLang('english')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center p-5 rounded-xl border-2 transition-all ${
              selectedLang === 'english' 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700'
            } relative overflow-hidden`}
          >
            {languageSymbols.english}
            <span className="font-medium text-gray-800 dark:text-white mt-3">English</span>
            
            {selectedLang === 'english' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </motion.button>
          
          <motion.button 
            onClick={() => setSelectedLang('hindi')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center p-5 rounded-xl border-2 transition-all ${
              selectedLang === 'hindi' 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700'
            } relative overflow-hidden`}
          >
            {languageSymbols.hindi}
            <span className="font-medium text-gray-800 dark:text-white mt-3">हिंदी</span>
            
            {selectedLang === 'hindi' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </motion.button>
        </div>
        
        <motion.button 
          onClick={handleChangeLanguage}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0.9 }}
          animate={{ 
            opacity: 1,
            boxShadow: "0px 10px 25px rgba(16, 185, 129, 0.2)"
          }}
          transition={{
            boxShadow: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
          }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-colors"
        >
          {translations.languageSelector.confirm}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
