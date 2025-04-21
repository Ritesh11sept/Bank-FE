import React, { useState, useEffect, useContext } from 'react';
import Row1 from './Row1';
import Row2 from './Row2';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import ErrorBoundary from '../ErrorBoundary';
import { useGetUserTransactionsQuery } from "../../state/api";
import { TranslationContext2 } from '../../context/TranslationContext2';

const gridTemplateLargeScreens = `
  "a a b"
  "a a b"
  "c c b"
  "c c d"
  "e e d"
  "e e d"
  "f f g"
  "f f g"
`;

const gridTemplateSmallScreens = `
  "a" 
  "a"
  "b"
  "b" 
  "c"
  "c"
  "d"
  "d"
  "e"
  "e"
  "f"
  "f"
  "g"
  "g"
`;

const Dashboard = () => {
  const [isAboveMediumScreens, setIsAboveMediumScreens] = useState(window.innerWidth >= 1200);
  const { data: userTransactions, isLoading, error, refetch } = useGetUserTransactionsQuery();
  
  // Get translations
  const { translations, language } = useContext(TranslationContext2) || { translations: {}, language: 'english' };
  const t = translations.analytics?.[language] || translations.analytics?.english || {
    loadingText: "Loading transaction data...",
    errorTitle: "Error loading transaction data.",
    tryAgain: "Try Again"
  };

  // Process transactions to create a sample data structure for child components
  const processTransactionData = () => {
    if (!userTransactions) return null;
    
    // For simplicity, we'll just pass the whole data object
    // Child components will handle their own data processing
    return userTransactions;
  };

  const transactionData = processTransactionData();

  useEffect(() => {
    const handleResize = () => {
      setIsAboveMediumScreens(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6 md:p-8 bg-white/90 backdrop-blur-lg overflow-auto" 
        style={{ height: 'calc(100vh - 64px)' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-lg text-emerald-700">{t.loadingText}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-red-500 text-xl mb-4">{t.errorTitle}</div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-w-full">
              {JSON.stringify(error, null, 2)}
            </pre>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              {t.tryAgain}
            </button>
          </div>
        ) : (
          <div 
            className="w-full grid gap-6 h-auto"
            style={{
              gridTemplateColumns: isAboveMediumScreens ? 'repeat(3, minmax(300px, 1fr))' : '1fr',
              gridTemplateAreas: isAboveMediumScreens ? gridTemplateLargeScreens : gridTemplateSmallScreens,
              gridAutoRows: 'minmax(80px, auto)',
              maxHeight: isAboveMediumScreens ? 'none' : 'auto',
            }}
          >
            <ErrorBoundary>
              <Row1 data={transactionData} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Row2 data={transactionData} />
            </ErrorBoundary>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
