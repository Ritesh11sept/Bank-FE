import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";

const Landing = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Analytics Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Track your financial performance with AI-powered insights",
      path: "/dashboard",
      stats: { value: "₹45,672", change: "+12.5%" },
      progress: 75
    },
    {
      title: "Account Balance",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M9 21V10m6 11V10M4 3h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        </svg>
      ),
      description: "View and manage your account transactions",
      path: "/account",
      stats: { value: "₹1,23,456", change: "+5.2%" },
      progress: 65
    },
    {
      title: "Market Analysis",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6m6-6a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6m-6 6a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6" />
        </svg>
      ),
      description: "Real-time market trends and predictions",
      path: "/predictions",
      stats: { value: "₹89,120", change: "-2.3%" },
      progress: 45
    },
    {
      title: "Quick Payments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V11a2 2 0 00-2-2h-2zm-6 0V7a3 3 0 016 0v2H7V7a3 3 0 016 0v2z" />
        </svg>
      ),
      description: "Fast and secure payment transactions",
      path: "/payments",
      stats: { value: "₹12,890", change: "+8.7%" },
      progress: 90
    },
    {
      title: "Savings Goals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856C18.627 19.837 19 18.92 19 18V6c0-.92-.373-1.837-1.071-2.5H6.071C5.373 4.163 5 5.08 5 6v12c0 .92.373 1.837 1.071 2.5z" />
        </svg>
      ),
      description: "Track and manage your saving targets",
      path: "/savings",
      stats: { value: "₹34,567", change: "+15.3%" },
      progress: 60
    },
    {
      title: "Digital Wallet",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V11a2 2 0 00-2-2h-2zm-6 0V7a3 3 0 016 0v2H7V7a3 3 0 016 0v2z" />
        </svg>
      ),
      description: "Manage your digital assets securely",
      path: "/wallet",
      stats: { value: "₹67,234", change: "+9.1%" },
      progress: 85
    },
    {
      title: "Credit Cards",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M9 21V10m6 11V10M4 3h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        </svg>
      ),
      description: "Manage your credit cards and rewards",
      path: "/cards",
      stats: { value: "₹23,456", change: "+3.8%" },
      progress: 70
    },
    {
      title: "Investments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6m6-6a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6m-6 6a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6" />
        </svg>
      ),
      description: "Track your investment portfolio",
      path: "/investments",
      stats: { value: "₹78,901", change: "+6.4%" },
      progress: 55
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Navbar />
      <Sidebar />
      <main className="flex-grow p-3 sm:ml-60 mt-16 bg-white">
        <div className="container mx-auto max-w-[1400px]">
          <div className="py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-8 text-4xl font-bold bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                Welcome Back, User!
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(card.path)}
                      className="p-6 h-full cursor-pointer bg-white border border-gray-100 rounded-lg transition-all duration-300 hover:border-[#10B981] hover:bg-[rgba(16,185,129,0.02)]"
                    >
                      <div className="mb-4 flex justify-between items-start">
                        <button className="p-3 rounded-full bg-[rgba(16,185,129,0.1)] text-[#10B981] hover:bg-[rgba(16,185,129,0.2)]">
                          {card.icon}
                        </button>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          card.stats.change.includes('+') 
                            ? 'bg-[rgba(16,185,129,0.1)] text-[#059669]' 
                            : 'bg-[rgba(239,68,68,0.1)] text-[#DC2626]'
                        }`}>
                          {card.stats.change}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                      <p className="text-gray-600 mb-4 text-sm">{card.description}</p>
                      <p className="text-xl font-medium mb-3">{card.stats.value}</p>

                      <div className="h-1.5 bg-[rgba(16,185,129,0.1)] rounded-full">
                        <div 
                          className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
