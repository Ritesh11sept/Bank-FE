import React from 'react';
import { Wallet, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

const AboutPotsDialog = ({ open, onClose }) => {
  if (!open) return null;

  const features = [
    {
      icon: <Wallet className="w-6 h-6 text-[#10B981]" />,
      primary: "Dedicated Savings",
      secondary: "Create separate pots for different goals like emergency funds, travel, or big purchases"
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#10B981]" />,
      primary: "2.5% Annual Interest",
      secondary: "Earn interest on your savings to help reach your goals faster"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#10B981]" />,
      primary: "Goal Tracking",
      secondary: "Set targets and track your progress with visual progress bars"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#10B981]" />,
      primary: "Flexible Management",
      secondary: "Easily deposit, withdraw, or modify your savings goals anytime"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] py-6 px-6">
          <h2 className="text-white text-xl font-semibold">About Savings Pots</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Savings Pots are smart and flexible ways to organize your savings for different goals.
            Think of them as digital piggy banks that help you save and track progress towards specific targets.
          </p>

          <h3 className="text-[#10B981] font-semibold text-lg mt-6 mb-4">Key Features</h3>

          <ul className="space-y-4">
            {features.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.primary}</h4>
                  <p className="text-gray-600">{item.secondary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2 text-white rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] 
                     hover:from-[#059669] hover:to-[#047857] transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPotsDialog;
