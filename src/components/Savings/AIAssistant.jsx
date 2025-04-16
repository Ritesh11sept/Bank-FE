import React, { useState, useEffect } from 'react';
import { CheckCircle2, X, LightbulbIcon, GiftIcon, CalendarIcon, DollarSign } from 'lucide-react';

const AIAssistant = ({ open, onClose, pot }) => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('savings');

  useEffect(() => {
    if (open && pot) {
      generateAdvice();
    }
  }, [open, pot]);

  const generateAdvice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const timeToReachGoal = calculateTimeToReachGoal();
      const monthlySavingsNeeded = calculateMonthlySavings();
      
      // Prepare meaningful context for the AI
      let prompt = `You are a financial advisor for a banking app. A user has created a savings pot named "${pot.name}" 
      with a category of "${pot.category}" and a goal of ₹${pot.goalAmount.toLocaleString()}. 
      They currently have ₹${pot.balance.toLocaleString()} saved.
      Based on their current savings rate, it would take approximately ${timeToReachGoal} to reach their goal,
      and they need to save about ₹${monthlySavingsNeeded} per month.
      
      Please provide the following advice in JSON format with these keys:
      1. "savingsTips": List 5 actionable tips to help them reach their savings goal faster
      2. "budgetAdvice": Practical budget advice specific to this goal
      3. "giftIdeas": If this is a gift-related goal, suggest 5 thoughtful gift options within this budget
      4. "travelSuggestions": If this is a travel/vacation pot, suggest 3-5 destinations or experiences that would fit their budget
      
      Keep each tip brief (max 2 sentences) and make them highly specific to the goal amount and category.
      Format as a valid JSON object.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate advice');
      }

      const data = await response.json();
      
      // Extract text content from response
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Try to parse JSON from the response
      try {
        // Extract JSON from text (in case AI adds extra text)
        const jsonMatch = aiResponse.match(/{[\s\S]*}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        const parsedAdvice = JSON.parse(jsonStr);
        setAdvice(parsedAdvice);
      } catch (jsonError) {
        console.error("Failed to parse JSON from AI response:", jsonError);
        // Fallback: create structured data from text
        setAdvice({
          savingsTips: [aiResponse.split('\n').slice(0, 5)],
          budgetAdvice: "Try to allocate a fixed percentage of your income to this goal every month.",
          giftIdeas: ["Based on your budget, consider thoughtful personalized items."],
          travelSuggestions: ["Research off-season travel deals to maximize your budget."]
        });
      }
    } catch (err) {
      console.error('Error generating AI advice:', err);
      setError('Sorry, we could not generate personalized advice at the moment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeToReachGoal = () => {
    if (!pot || pot.balance >= pot.goalAmount) return "0 months";
    
    // Assume a simple monthly saving of 10% of the remaining amount
    const remaining = pot.goalAmount - pot.balance;
    const monthlyRate = remaining * 0.1;
    const months = Math.ceil(remaining / monthlyRate);
    
    if (months < 12) {
      return `${months} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  const calculateMonthlySavings = () => {
    if (!pot) return 0;
    const remaining = pot.goalAmount - pot.balance;
    // Calculate savings needed for 6 months
    return Math.ceil(remaining / 6);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 mb-2 pr-8">
            AI Financial Assistant
          </h2>
          <p className="text-gray-500">
            Personalized advice for your "{pot?.name}" savings goal
          </p>
        </div>
        
        <div className="border-b border-gray-100">
          <div className="flex px-6 pt-4">
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'savings'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign size={18} />
                Savings Tips
              </div>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'budget'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <LightbulbIcon size={18} />
                Budget Advice
              </div>
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'suggestions'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {pot?.category?.includes('gift') ? (
                  <GiftIcon size={18} />
                ) : (
                  <CalendarIcon size={18} />
                )}
                {pot?.category?.includes('gift') ? 'Gift Ideas' : 'Recommendations'}
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-500">Generating personalized advice...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600">
              {error}
            </div>
          ) : (
            <div>
              {activeTab === 'savings' && advice?.savingsTips && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">How to reach your goal faster:</h3>
                  <div className="space-y-3">
                    {Array.isArray(advice.savingsTips) ? 
                      advice.savingsTips.map((tip, index) => (
                        <div key={index} className="flex gap-3 bg-emerald-50 p-3 rounded-lg">
                          <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      )) : 
                      <p className="text-gray-500">No savings tips available</p>
                    }
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Goal Timeline: </span> 
                      At your current rate, you could reach your goal in approximately {calculateTimeToReachGoal()}.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Suggested Monthly Savings: </span>
                      ₹{calculateMonthlySavings().toLocaleString()} per month to reach your goal in 6 months.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'budget' && advice?.budgetAdvice && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Budget Recommendations:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{advice.budgetAdvice}</p>
                  </div>
                  
                  <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Budget Breakdown Suggestion</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded border border-amber-100">
                        <p className="text-xs text-gray-500">Monthly Goal</p>
                        <p className="font-semibold text-gray-800">₹{calculateMonthlySavings().toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white rounded border border-amber-100">
                        <p className="text-xs text-gray-500">Weekly</p>
                        <p className="font-semibold text-gray-800">₹{Math.ceil(calculateMonthlySavings()/4).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white rounded border border-amber-100">
                        <p className="text-xs text-gray-500">Daily</p>
                        <p className="font-semibold text-gray-800">₹{Math.ceil(calculateMonthlySavings()/30).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white rounded border border-amber-100">
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="font-semibold text-gray-800">₹{(pot.goalAmount - pot.balance).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'suggestions' && (
                <div>
                  {pot?.category?.includes('gift') && advice?.giftIdeas ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Gift Ideas within Your Budget:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.isArray(advice.giftIdeas) ? 
                          advice.giftIdeas.map((gift, index) => (
                            <div key={index} className="border border-purple-100 bg-purple-50 p-3 rounded-lg">
                              <div className="flex items-start gap-2">
                                <GiftIcon className="text-purple-500 shrink-0 mt-1" size={16} />
                                <p className="text-gray-700">{gift}</p>
                              </div>
                            </div>
                          )) : 
                          <p className="text-gray-500">No gift ideas available</p>
                        }
                      </div>
                    </div>
                  ) : advice?.travelSuggestions ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Travel Recommendations:</h3>
                      <div className="space-y-3">
                        {Array.isArray(advice.travelSuggestions) ? 
                          advice.travelSuggestions.map((suggestion, index) => (
                            <div key={index} className="border border-cyan-100 bg-cyan-50 p-3 rounded-lg">
                              <div className="flex items-start gap-2">
                                <CalendarIcon className="text-cyan-500 shrink-0 mt-1" size={16} />
                                <p className="text-gray-700">{suggestion}</p>
                              </div>
                            </div>
                          )) : 
                          <p className="text-gray-500">No travel suggestions available</p>
                        }
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No specific recommendations available for this category
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
