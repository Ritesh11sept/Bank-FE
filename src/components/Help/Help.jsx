import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronDown, FaChevronUp, FaTicketAlt, FaPlus } from 'react-icons/fa';
import TicketForm from './TicketForm';
import UserTickets from './UserTickets';
import TicketDetails from './TicketDetails';

const Help = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const faqs = [
    {
      question: "How do I set up automatic savings?",
      answer: "You can set up automatic savings by going to the Savings tab, clicking 'Create New Pot', and toggling the 'Automatic Savings' option. From there, you can set the amount and frequency of your automatic deposits."
    },
    {
      question: "What are Treasures and how do they work?",
      answer: "Treasures are investment opportunities that our platform offers. They represent various financial products like mutual funds, stocks, or bonds that you can invest in. Navigate to the Treasures section to explore available options and their historical performance."
    },
    {
      question: "How can I change my security settings?",
      answer: "You can change your security settings by clicking on the Settings icon in the sidebar. Under the 'Security' tab, you'll find options to update your password, enable two-factor authentication, and manage login notifications."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">Help Center</h2>
          <button
            className="text-gray-500 hover:text-gray-800 transition-colors"
            onClick={onClose}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'faq' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('faq');
              setSelectedTicket(null);
            }}
          >
            FAQs
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'tickets' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('tickets');
              setSelectedTicket(null);
            }}
          >
            My Tickets
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'new' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('new');
              setSelectedTicket(null);
            }}
          >
            New Ticket
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 128px)' }}>
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Frequently Asked Questions</h3>
              
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-5 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <FaChevronUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 bg-gray-50 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  Couldn't find what you were looking for? Create a new support ticket and our team will assist you.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Create New Ticket
                </button>
              </div>
            </div>
          )}

          {/* User Tickets Tab */}
          {activeTab === 'tickets' && (
            <div>
              {selectedTicket ? (
                <TicketDetails 
                  ticket={selectedTicket} 
                  onBack={() => setSelectedTicket(null)} 
                />
              ) : (
                <UserTickets onSelectTicket={setSelectedTicket} />
              )}
            </div>
          )}

          {/* New Ticket Tab */}
          {activeTab === 'new' && (
            <TicketForm 
              onSubmitSuccess={() => setActiveTab('tickets')} 
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Help;
