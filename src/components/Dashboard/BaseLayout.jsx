import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Chatbot from "../../chatbot";

const BaseLayout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {children}

      {/* Floating Chat Button */}
      <button
        aria-label="chat"
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-colors"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageSquare />
      </button>

      {/* Chatbot Dialog */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChatOpen(false);
          }}
        >
          <div className="w-[90%] max-w-[800px] max-h-[90vh] rounded-2xl overflow-hidden shadow-lg bg-white">
            <Chatbot onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseLayout;
