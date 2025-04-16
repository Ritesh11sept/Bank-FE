import React, { useState } from 'react';
import DashboardLayout from "./DashboardLayout";
import { Plus, Info, BarChart3, Calendar, Sparkles, Wallet, TrendingUp, X } from 'lucide-react';
import { useGetPotsQuery, useDeletePotMutation } from "../../state/api";
import { POT_CATEGORIES } from '../Savings/constants/potCategories';
import AboutPotsDialog from '../Savings/AboutPotsDialog';
import CreatePotDialog from '../Savings/CreatePotDialog';
import TransactionDialog from '../Savings/TransactionDialogs';
import SetGoalDialog from '../Savings/SetGoalDialog';
import PotGrid from '../Savings/PotGrid';
import AIAssistant from '../Savings/AIAssistant';
import axios from '../../utils/axios';

const StatCard = ({ icon, label, value, color }) => {
  const bgColor = `bg-${color}-50`;
  const textColor = `text-${color}-600`;
  const iconColor = `text-${color}-500`;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border border-gray-50">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {React.cloneElement(icon, { className: iconColor, size: 22 })}
        </div>
        <div>
          <p className="mb-1 text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Savings = () => {
  const { data: pots = [], isLoading, error: queryError } = useGetPotsQuery();
  const [deletePot] = useDeletePotMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  const [selectedPot, setSelectedPot] = useState(null);
  const [formData, setFormData] = useState({
    amount: 0,
    goalAmount: 0
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [showNewUserGuide, setShowNewUserGuide] = useState(() => {
    const shown = localStorage.getItem('savings-guide-shown');
    return !shown && pots.length < 2;
  });

  const notifyPotReward = async (action, amount, potName) => {
    try {
      await axios.post('/rewards/pot-reward', {
        action,
        amount: amount || 0,
        potName
      });
    } catch (error) {
      console.error('Error notifying pot reward:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleDeletePot = async (potId) => {
    try {
      const result = await deletePot(potId).unwrap();
      if (result && result.pot) {
        await notifyPotReward('delete', 0, result.pot.name);
      }
      showAlert('Pot deleted successfully', 'success');
    } catch (error) {
      showAlert(error?.data?.message || 'Failed to delete pot', 'error');
    }
  };

  const handleShowAIAssistant = (pot) => {
    setSelectedPot(pot);
    setIsAIAssistantOpen(true);
  };

  const handleCreatePotSuccess = async (message, potData) => {
    showAlert(message, 'success');
    if (potData) {
      await notifyPotReward('create', 0, potData.name);
      
      // Show AI assistant after pot creation with goal
      if (potData.goalAmount > 0) {
        setTimeout(() => {
          setSelectedPot(potData);
          setIsAIAssistantOpen(true);
        }, 1000);
      }
    }
  };

  // Calculate statistics
  const totalSavings = pots.reduce((sum, pot) => sum + pot.balance, 0);
  const totalGoals = pots.filter(pot => pot.goalAmount > 0).length;
  const completedGoals = pots.filter(pot => pot.goalAmount > 0 && pot.balance >= pot.goalAmount).length;
  const annualInterest = (totalSavings * 0.025).toFixed(2);

  // Dismiss new user guide and store in localStorage
  const dismissGuide = () => {
    setShowNewUserGuide(false);
    localStorage.setItem('savings-guide-shown', 'true');
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full p-5 md:p-7 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-64px)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              Savings Pots
            </h1>
            <p className="text-gray-600 flex items-center gap-2 text-sm">
              <Info size={16} />
              Save for your goals and earn 2.5% interest annually
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAboutDialogOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              About Pots
            </button>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Pot
            </button>
          </div>
        </div>

        {showNewUserGuide && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl relative border border-emerald-100">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" 
              onClick={dismissGuide}
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Sparkles size={32} className="text-amber-500 mb-2" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Savings with AI Assistance
                </h3>
                <p className="text-gray-600 mb-3">
                  Create savings pots for different goals and get personalized AI tips to help you reach them faster.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">•</div>
                    <span>Create different pots for different goals</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">•</div>
                    <span>Get AI-powered savings tips and gift recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">•</div>
                    <span>Track your progress with visual indicators</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<Wallet />}
            label="Total Savings"
            value={`₹${totalSavings.toLocaleString()}`}
            color="emerald"
          />
          <StatCard 
            icon={<TrendingUp />}
            label="Annual Interest"
            value={`₹${annualInterest}`}
            color="blue"
          />
          <StatCard 
            icon={<BarChart3 />}
            label="Active Goals"
            value={`${totalGoals - completedGoals} of ${totalGoals}`}
            color="amber"
          />
          <StatCard 
            icon={<Calendar />}
            label="Completed Goals"
            value={completedGoals}
            color="purple"
          />
        </div>

        {isLoading ? (
          <div className="p-6 text-center bg-white rounded-2xl shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        ) : queryError ? (
          <div className="p-8 text-center bg-white rounded-2xl shadow-sm">
            <p className="text-red-500 font-medium">
              {typeof queryError === 'string' ? queryError : 'Failed to load your savings pots'}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <PotGrid
              onDeposit={(pot) => {
                setSelectedPot(pot);
                setFormData(prev => ({ ...prev, amount: 0 }));
                setIsDepositDialogOpen(true);
              }}
              onWithdraw={(pot) => {
                setSelectedPot(pot);
                setFormData(prev => ({ ...prev, amount: 0 }));
                setIsWithdrawDialogOpen(true);
              }}
              onSetGoal={(pot) => {
                setSelectedPot(pot);
                setFormData(prev => ({ ...prev, goalAmount: pot.goalAmount || 0 }));
                setIsGoalDialogOpen(true);
              }}
              onDelete={handleDeletePot}
              onCreateNew={() => setIsCreateDialogOpen(true)}
              onShowAiAssistant={handleShowAIAssistant}
            />
          </div>
        )}

        <CreatePotDialog 
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleCreatePotSuccess}
          potCategories={POT_CATEGORIES}
        />

        <TransactionDialog 
          type="deposit"
          open={isDepositDialogOpen}
          onClose={() => setIsDepositDialogOpen(false)}
          onSuccess={async (message, transactionData) => {
            showAlert(message, 'success');
            if (transactionData && selectedPot) {
              await notifyPotReward(
                'deposit', 
                transactionData.amount, 
                selectedPot.name
              );
            }
          }}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <TransactionDialog 
          type="withdraw"
          open={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onSuccess={async (message, transactionData) => {
            showAlert(message, 'success');
            if (transactionData && selectedPot) {
              await notifyPotReward(
                'withdraw', 
                transactionData.amount, 
                selectedPot.name
              );
            }
          }}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <SetGoalDialog 
          open={isGoalDialogOpen}
          onClose={() => setIsGoalDialogOpen(false)}
          onSuccess={async (message, goalData) => {
            showAlert(message, 'success');
            if (goalData && selectedPot) {
              await notifyPotReward(
                'set-goal', 
                goalData.goalAmount, 
                selectedPot.name
              );
              
              // Show AI assistant after setting a goal
              setTimeout(() => {
                setSelectedPot({...selectedPot, goalAmount: goalData.goalAmount});
                setIsAIAssistantOpen(true);
              }, 1000);
            }
          }}
          selectedPot={selectedPot}
          goalAmount={formData.goalAmount}
          onGoalAmountChange={handleInputChange}
        />

        <AboutPotsDialog 
          open={isAboutDialogOpen}
          onClose={() => setIsAboutDialogOpen(false)}
        />

        <AIAssistant
          open={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          pot={selectedPot}
        />

        {alert.open && (
          <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-lg z-50 ${
            alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {alert.message}
              <button
                onClick={() => setAlert(prev => ({ ...prev, open: false }))}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Savings;