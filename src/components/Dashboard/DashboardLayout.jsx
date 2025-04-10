import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";
import Chatbot from "../../chatbot";
import { MessageSquare } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  
  useEffect(() => {
    // Start animation after a delay
    const timer = setTimeout(() => {
      setAnimateButton(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-grow lg:ml-64 min-h-screen w-full">
        <Navbar setMobileOpen={setMobileOpen} toggleChatbot={toggleChatbot} />
        <div className="p-4 md:p-6 mt-16">
          {children}
        </div>
        
        {/* Chatbot button */}
        {!showChatbot && (
          <button 
            onClick={toggleChatbot}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center z-50 ${
              animateButton ? 'animate-bounce-subtle animate-pulse-glow' : ''
            }`}
            aria-label="Open chat assistant"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
        
        {/* Chatbot container - Updated dimensions */}
        {showChatbot && (
          <div className="fixed bottom-0 right-0 z-50 w-[400px] h-[70vh] m-6">
            <Chatbot 
              onClose={toggleChatbot} 
              containerClass="w-full h-full shadow-2xl" 
            />
          </div>
        )}
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.9); }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
