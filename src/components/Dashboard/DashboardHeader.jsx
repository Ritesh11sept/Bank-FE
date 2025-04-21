import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  CurrencyDollarIcon, 
  CashIcon
} from "@heroicons/react/outline";
import { TranslationContext2 } from "../../context/TranslationContext2";

const DashboardHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Get translations
  const translationContext = useContext(TranslationContext2);
  const { translations } = translationContext || { 
    translations: { 
      dashboard: { 
        header: {
          home: "Home",
          dashboard: "Dashboard",
          predictions: "Predictions",
          insights: "Insights",
          treasures: "Treasures",
          savings: "Savings",
          logout: "Logout"
        }
      }
    } 
  };
  
  const { dashboard } = translations;
  const headerText = dashboard.header;

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate("/home");
  };

  const navItems = [
    { path: "/landing", name: headerText.home, icon: HomeIcon },
    { path: "/dashboard", name: headerText.dashboard, icon: ChartBarIcon },
    { path: "/predictions", name: headerText.predictions, icon: LightBulbIcon },
    { path: "/insights", name: headerText.insights, icon: CurrencyDollarIcon },
    { path: "/treasures", name: headerText.treasures, icon: CashIcon },
    { path: "/savings", name: headerText.savings, icon: CashIcon },
  ];

  return (
    <div className="w-full shadow-md bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex-shrink-0">
            <Link to="/landing" className="flex items-center">
              <img
                src="/logo.png" 
                alt="Logo"
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40x40?text=Logo";
                }}
              />
              <span className="font-bold text-xl text-indigo-700">BankSage</span>
            </Link>
          </div>

          <div className="flex space-x-1 md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-2 py-1 rounded-md transition-all duration-200 ${
                  currentPath === item.path
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon 
                  className={`h-6 w-6 ${
                    currentPath === item.path ? "text-white" : "text-gray-700"
                  }`} 
                />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
              aria-label={headerText.logout}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              <span className="text-xs mt-1">{headerText.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
