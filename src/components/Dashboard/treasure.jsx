import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiGift, FiAward, FiUsers, FiCreditCard, FiShoppingBag, 
  FiArrowRight, FiCheck, FiCopy, FiCalendar, FiStar, 
  FiTrendingUp, FiClock, FiX, FiPlay
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
import { 
  useGetUserRewardsQuery, 
  useUpdateLoginStreakMutation,
  useRevealScratchCardMutation,
  useSubmitGameScoreMutation 
} from "../state/api";

const Treasures = () => {
  // Game states
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [activeScratchCard, setActiveScratchCard] = useState(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Canvas refs
  const gameCanvasRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  
  // Fetch user rewards data
  const { data: rewardsData, isLoading: isLoadingRewards, refetch: refetchRewards } = useGetUserRewardsQuery();
  const [updateLoginStreak] = useUpdateLoginStreakMutation();
  const [revealScratchCard] = useRevealScratchCardMutation();
  const [submitGameScore] = useSubmitGameScoreMutation();
  
  const userData = rewardsData?.rewards || {
    points: 0,
    loginStreak: 0,
    scratchCards: []
  };

  // Update login streak only once per day
  useEffect(() => {
    const updateStreak = async () => {
      // Check if we've already updated the streak today
      const lastStreakUpdate = sessionStorage.getItem('lastLoginStreakUpdate');
      const today = new Date().toDateString();
      
      // Only update if not already updated today in this session
      if (lastStreakUpdate !== today) {
        try {
          await updateLoginStreak().unwrap();
          // Mark that we've updated the streak for today
          sessionStorage.setItem('lastLoginStreakUpdate', today);
          // Refetch rewards to show the updated data
          refetchRewards();
        } catch (error) {
          console.error("Failed to update login streak", error);
        }
      }
    };
    
    updateStreak();
  }, [updateLoginStreak, refetchRewards]);
  
  // Handle copying referral code
  const handleCopyReferral = () => {
    navigator.clipboard.writeText("BANKAPP123456");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Handle scratch card revealing
  const handleScratchCard = async (id) => {
    setActiveScratchCard(id);
    
    // Simulate scratching progress
    const interval = setInterval(() => {
      setScratchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Reveal reward after scratching complete
          setTimeout(async () => {
            try {
              await revealScratchCard(id).unwrap();
              // Refetch rewards to get the updated data
              refetchRewards();
            } catch (error) {
              console.error("Failed to reveal scratch card", error);
            }
            setActiveScratchCard(null);
            setScratchProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };
  
  // Game logic
  const startGame = () => {
    setIsGameActive(true);
    setGameScore(0);
    setGameTime(30);
    setGameOver(false);
    setGameResult(null);
    
    // Initialize target position
    moveTarget();
  };
  
  const moveTarget = () => {
    if (gameCanvasRef.current) {
      const canvas = gameCanvasRef.current;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Generate random position within canvas boundaries
      targetRef.current = {
        x: Math.random() * (width - 40),
        y: Math.random() * (height - 40)
      };
      
      // Force re-render to update target position
      setGameScore(prev => prev);
    }
  };
  
  const hitTarget = () => {
    setGameScore(prev => prev + 10);
    moveTarget();
  };
  
  // Game timer
  useEffect(() => {
    let timer;
    
    if (isGameActive && !gameOver) {
      timer = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isGameActive, gameOver]);
  
  // Submit game score when game is over
  useEffect(() => {
    const submitScore = async () => {
      if (gameOver && gameScore > 0) {
        try {
          const result = await submitGameScore({ 
            game: "Target Hit", 
            score: gameScore 
          }).unwrap();
          
          setGameResult(result);
        } catch (error) {
          console.error("Failed to submit game score", error);
        }
      }
    };
    
    if (gameOver) {
      submitScore();
    }
  }, [gameOver, gameScore, submitGameScore]);
  
  // Get valid scratch cards
  const validScratchCards = userData.scratchCards?.filter(card => {
    const expiry = new Date(card.expiry);
    return expiry > new Date();
  }) || [];
  
  // Format dates helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateString);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Offers data - could be fetched from API in a real app
  const offers = [
    {
      id: 1,
      title: "10% cashback on groceries",
      description: "Get 10% cashback up to ₹100 on grocery shopping with your debit card",
      code: "GROCERY10",
      validTill: "31 Dec 2023",
      icon: <FiShoppingBag className="text-orange-500" />
    },
    {
      id: 2,
      title: "Zero fee on international transactions",
      description: "No transaction fee on international payments this weekend",
      code: "INTLFREE",
      validTill: "31 Dec 2023",
      icon: <FiCreditCard className="text-blue-500" />
    }
  ];

  const TreasuresContent = () => (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Rewards & Treasures</h1>
        <div className="flex items-center text-emerald-600 gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
          <FiAward size={20} />
          <span className="font-medium">{userData.points || 0} Reward Points</span>
        </div>
      </div>

      {/* Login Streak Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            <span>Daily Login Streak</span>
          </h2>
          <span className="text-sm text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
            Day {userData.loginStreak || 0}
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={`relative h-16 rounded-lg ${i < (userData.loginStreak % 7) ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center`}>
              <span className="text-sm font-medium text-white">Day {i+1}</span>
              {i < (userData.loginStreak % 7) && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-blue-500">
                  <FiCheck className="text-blue-500 text-xs" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Weekly Reward (Day 7)</div>
            <div className="font-medium text-blue-700">
              Special Scratch Card + 50 Points
            </div>
          </div>
          <div className="text-sm">
            {userData.loginStreak % 7 === 0 ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Claimed Today!
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {7 - (userData.loginStreak % 7)} days remaining
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column with scratch cards and game */}
        <div className="lg:col-span-2">
          {/* Scratch cards section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiGift className="text-purple-600" />
                <span>Scratch Cards</span>
              </h2>
              <span className="text-sm text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm">
                {validScratchCards.filter(card => !card.isRevealed).length} Available
              </span>
            </div>

            {validScratchCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {validScratchCards.map(card => (
                  <div 
                    key={card.id} 
                    className="relative rounded-lg overflow-hidden shadow-md"
                  >
                    {/* Card that hasn't been scratched or is being scratched */}
                    {!card.isRevealed && (
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
                              Expires in {getDaysRemaining(card.expiry)} days
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Revealed card */}
                    {card.isRevealed && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white h-40 border-2 border-purple-300 flex flex-col items-center justify-center p-4"
                        >
                          <div className="text-sm text-gray-500 mb-1">You've won</div>
                          <div className="text-2xl font-bold text-purple-700 mb-2">
                            {card.value} {card.type === "cashback" ? "Cashback" : card.type === "discount" ? "Off" : "Points"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Reward already applied to your account
                          </div>
                          <div className="absolute bottom-2 text-xs text-gray-400">
                            Expires on {formatDate(card.expiry)}
                          </div>
                        </motion.div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-gray-500 mb-2">No scratch cards available right now</div>
                <div className="text-sm text-gray-400">
                  Come back tomorrow for new rewards or continue your login streak
                </div>
              </div>
            )}
          </div>
          
          {/* Mini-Game Section */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiPlay className="text-pink-600" />
                <span>Quick Hit Game</span>
              </h2>
              {isGameActive && !gameOver && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    Score: {gameScore}
                  </span>
                  <span className="text-sm text-red-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    Time: {gameTime}s
                  </span>
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {!isGameActive && !gameOver && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg p-6 text-center"
                >
                  <div className="text-gray-700 mb-3">Play "Quick Hit" and earn reward points!</div>
                  <div className="text-sm text-gray-500 mb-4">
                    Hit as many targets as you can in 30 seconds. Each hit gives you 10 points!
                  </div>
                  <button 
                    onClick={startGame}
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                  >
                    Start Game
                  </button>
                </motion.div>
              )}
              
              {isGameActive && !gameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg p-2 h-64 relative"
                  ref={gameCanvasRef}
                >
                  <motion.div
                    className="absolute w-12 h-12 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 active:scale-95 transition-all"
                    style={{ 
                      left: targetRef.current.x, 
                      top: targetRef.current.y 
                    }}
                    onClick={hitTarget}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiStar className="text-white text-xl" />
                  </motion.div>
                </motion.div>
              )}
              
              {gameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg p-6 text-center"
                >
                  <div className="text-xl font-bold text-gray-800 mb-2">Game Over!</div>
                  <div className="text-2xl font-bold text-pink-600 mb-4">Your Score: {gameScore}</div>
                  
                  {gameResult && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                      <div className="text-green-700 font-medium mb-1">
                        You earned {gameResult.pointsAwarded} reward points!
                      </div>
                      <div className="text-sm text-green-600">
                        New total: {gameResult.rewards.points} points
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={startGame}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                    >
                      Play Again
                    </button>
                    <button 
                      onClick={() => setGameOver(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

        {/* Right column - Stats, Referrals and Leaderboard */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Rewards Summary</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="text-xs text-blue-500 mb-1">Total Points</div>
                <div className="text-2xl font-bold text-blue-700">{userData.points || 0}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <div className="text-xs text-emerald-500 mb-1">Login Streak</div>
                <div className="text-2xl font-bold text-emerald-700">{userData.loginStreak || 0} days</div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-purple-500">Weekly Progress</div>
                <div className="text-xs text-purple-700 font-medium">
                  Day {userData.loginStreak % 7}/7
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2.5 mb-2">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(userData.loginStreak % 7) * 100 / 7}%` }}
                ></div>
              </div>
              <div className="text-sm text-purple-600">
                {7 - (userData.loginStreak % 7)} days to weekly bonus
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Points Value
              </div>
              <div className="text-sm font-medium">
                ₹{((userData.points || 0) * 0.05).toFixed(2)}
              </div>
            </div>
          </div>
          
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
          
          {/* Leaderboard Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FiTrendingUp className="text-blue-600" />
              <span>Point Leaders</span>
            </h2>
            
            <div className="space-y-3">
              {/* Sample leaderboard entries */}
              {[
                { name: "Priya S.", points: 1250, position: 1 },
                { name: "Rahul K.", points: 980, position: 2 },
                { name: "Ananya M.", points: 875, position: 3 },
                { name: "You", points: userData.points || 0, position: 5, isUser: true }
              ].map((user, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.isUser ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      user.position <= 3 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {user.position}
                    </div>
                    <div className={`font-medium ${user.isUser ? 'text-blue-700' : 'text-gray-700'}`}>
                      {user.name}
                    </div>
                  </div>
                  <div className="font-mono font-medium">{user.points}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:underline">
                View Full Leaderboard
              </button>
            </div>
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
