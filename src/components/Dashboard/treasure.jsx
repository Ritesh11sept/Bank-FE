import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGift, FiAward, FiUsers, FiCreditCard, FiShoppingBag, FiArrowRight, FiCheck, FiCopy } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

const Treasures = () => {
  const [activeScratchCard, setActiveScratchCard] = useState(null);
  const [revealedRewards, setRevealedRewards] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  // Simulate scratch card revealing
  const handleScratchCard = (id) => {
    setActiveScratchCard(id);
    
    // Simulate scratching progress
    const interval = setInterval(() => {
      setScratchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Reveal reward after scratching complete
          setTimeout(() => {
            setRevealedRewards(prev => [...prev, id]);
            setActiveScratchCard(null);
            setScratchProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Handle referral code copy
  const handleCopyReferral = () => {
    navigator.clipboard.writeText("BANKAPP123456");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset copied state on unmount
  useEffect(() => {
    return () => {
      setIsCopied(false);
    };
  }, []);

  // Reward data
  const scratchCards = [
    { id: 1, type: "cashback", value: "₹50", isNew: true, expiry: "3 days" },
    { id: 2, type: "discount", value: "20%", isNew: false, expiry: "5 days" },
    { id: 3, type: "points", value: "100", isNew: true, expiry: "7 days" }
  ];

  // Offers data
  const offers = [
    {
      id: 1,
      title: "10% cashback on groceries",
      description: "Get 10% cashback up to ₹100 on grocery shopping with your debit card",
      code: "GROCERY10",
      validTill: "31 Jul 2023",
      icon: <FiShoppingBag className="text-orange-500" />
    },
    {
      id: 2,
      title: "Zero fee on international transactions",
      description: "No transaction fee on international payments this weekend",
      code: "INTLFREE",
      validTill: "30 Jun 2023",
      icon: <FiCreditCard className="text-blue-500" />
    }
  ];

  const TreasuresContent = () => (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Rewards & Treasures</h1>
        <div className="flex items-center text-emerald-600 gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
          <FiAward size={20} />
          <span className="font-medium">150 Reward Points</span>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scratch cards section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiGift className="text-purple-600" />
                <span>Scratch Cards</span>
              </h2>
              <span className="text-sm text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm">
                3 Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scratchCards.map(card => (
                <div 
                  key={card.id} 
                  className="relative rounded-lg overflow-hidden shadow-md"
                >
                  {/* Card that hasn't been scratched or is being scratched */}
                  {!revealedRewards.includes(card.id) && (
                    <div 
                      className="bg-gradient-to-br from-indigo-500 to-purple-600 cursor-pointer h-40 flex items-center justify-center relative overflow-hidden"
                      onClick={() => !activeScratchCard && handleScratchCard(card.id)}
                    >
                      {activeScratchCard === card.id ? (
                        <div className="w-full h-full">
                          {/* Scratching animation */}
                          <div className="absolute inset-0 bg-gray-300 opacity-50 flex items-center justify-center">
                            <div className="w-4/5 h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 transition-all duration-100"
                                style={{ width: `${scratchProgress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 text-xs bg-white/80 px-2 py-1 rounded-full">
                            Scratching...
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-white text-center p-4">
                            <div className="text-xl font-bold mb-1">Scratch & Win</div>
                            <div className="text-white/80 text-sm">Tap to reveal your reward</div>
                          </div>
                          {card.isNew && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-0.5 rounded text-gray-900 font-medium">
                              NEW
                            </div>
                          )}
                          <div className="absolute bottom-2 text-xs w-full text-center text-white/70">
                            Expires in {card.expiry}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Revealed card */}
                  {revealedRewards.includes(card.id) && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white h-40 border-2 border-purple-300 flex flex-col items-center justify-center p-4"
                    >
                      <div className="text-sm text-gray-500 mb-1">You've won</div>
                      <div className="text-2xl font-bold text-purple-700 mb-2">
                        {card.value} {card.type === "cashback" ? "Cashback" : card.type === "discount" ? "Off" : "Points"}
                      </div>
                      <button className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-purple-700 transition-colors">
                        {card.type === "cashback" ? "Redeem Now" : card.type === "discount" ? "Use Discount" : "Add to Wallet"}
                      </button>
                      <div className="absolute bottom-2 text-xs text-gray-400">
                        Valid for {card.expiry}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Offers section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiShoppingBag className="text-orange-500" />
                <span>Exclusive Offers</span>
              </h2>
              <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                View All <FiArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {offers.map(offer => (
                <div key={offer.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {offer.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{offer.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
                      <div className="flex items-center mt-3 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                            {offer.code}
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <FiCopy size={14} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Valid till: {offer.validTill}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Referrals and investment card */}
        <div className="space-y-6">
          {/* Refer & Earn Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FiUsers className="text-emerald-600" />
              <span>Refer & Earn</span>
            </h2>
            
            <div className="text-gray-700 text-sm mb-4">
              Invite your friends to join our banking app and both of you can earn rewards!
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4 border border-emerald-100">
              <div className="text-xs text-gray-500 mb-1">Your Referral Code</div>
              <div className="flex items-center justify-between">
                <div className="font-mono font-medium text-lg">BANKAPP123456</div>
                <button 
                  onClick={handleCopyReferral}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isCopied ? 
                    <FiCheck size={16} className="text-emerald-600" /> : 
                    <FiCopy size={16} className="text-gray-500" />
                  }
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4 text-center">
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">₹100</div>
                <div className="text-xs text-gray-500">For you</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">₹50</div>
                <div className="text-xs text-gray-500">For friend</div>
              </div>
            </div>
            
            <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 font-medium">
              Invite Friends <FiUsers size={16} />
            </button>
          </div>
          
          {/* Investment Portfolio Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Investment Portfolio</h2>
            <p className="text-gray-600 text-sm mb-4">
              Invest your rewards and cashbacks to grow your wealth. Start with as little as ₹100.
            </p>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4 text-sm">
              Investing your rewards can help you earn up to 12% annual returns.
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
              Explore Investment Options <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap the content with the DashboardLayout
  return (
    <DashboardLayout>
      <TreasuresContent />
    </DashboardLayout>
  );
};

export default Treasures;
