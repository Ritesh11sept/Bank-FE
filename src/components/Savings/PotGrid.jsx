import React, { useEffect, useState } from 'react';
import { Target, Trash2, X, PiggyBank, TrendingUp, BarChart } from 'lucide-react';
import { POT_CATEGORIES } from './constants/potCategories';
import GoalCompletionCelebration from '../savings/GoalCompletionCelebration';
import axios from '../../utils/axios';
import { useGetPotsQuery } from '../../state/api';

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  potName,
  balance
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full m-4">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <Trash2 size={20} />
          <h2 className="text-lg font-semibold">Delete Savings Pot</h2>
        </div>
        <div className="mb-6">
          <p className="mb-4">
            Are you sure you want to delete <strong>{potName}</strong>?
          </p>
          {balance > 0 && (
            <p className="p-4 bg-slate-50 rounded-lg text-gray-600 text-sm">
              The remaining balance of <strong>₹{balance.toLocaleString()}</strong> will be transferred to your wallet.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Pot
          </button>
        </div>
      </div>
    </div>
  );
};

const PotGrid = ({
  onDeposit,
  onWithdraw,
  onSetGoal,
  onDelete,
  onCreateNew,
  onShowAiAssistant
}) => {
  const { data: rtkPots, isLoading: rtkLoading, error: rtkError, refetch } = useGetPotsQuery();

  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    activeGoals: true,
    noGoalPots: true
  });

  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    potId: null,
    potName: '',
    balance: 0
  });

  const [showCelebration, setShowCelebration] = useState({
    show: false,
    potName: '',
    goalAmount: 0
  });

  const fetchPots = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to view your savings pots');
        setLoading(false);
        return;
      }

      console.log('Fetching pots from API...');
      const response = await axios.get('/pots');
      console.log('Pots response:', response);

      if (response && response.data) {
        setPots(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching pots:', err);

      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError(`Connection error: Could not connect to the server at ${axios.defaults.baseURL || 'API server'}. Please verify the backend is running.`);
      } else if (err.response && err.response.status === 401) {
        setError('Authentication error. Please log in again.');
      } else if (err.response && err.response.status === 403) {
        setError('You do not have permission to access this resource.');
      } else if (err.response && err.response.status === 404) {
        setError('The requested resource was not found. Verify API endpoints.');
      } else {
        setError(`Failed to load your savings pots: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rtkPots) {
      setPots(rtkPots);
      setLoading(false);
    } else if (rtkError) {
      fetchPots();
    }
  }, [rtkPots, rtkError]);

  useEffect(() => {
    if (!rtkPots && !rtkError) {
      fetchPots();
    }
  }, []);

  const handlePotUpdate = async () => {
    await fetchPots();
  };

  const notifyPotReward = async (action, amount, potName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post('/rewards/pot-reward', {
        action,
        amount: amount || 0,
        potName
      });
    } catch (err) {
      console.error('Error logging pot reward:', err);
    }
  };

  const handleDeleteClick = (pot) => {
    setDeleteDialog({
      open: true,
      potId: pot._id,
      potName: pot.name,
      balance: pot.balance
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.potId) {
      try {
        await onDelete(deleteDialog.potId);
        await notifyPotReward('delete', 0, deleteDialog.potName);
        await fetchPots();
      } catch (err) {
        console.error('Error deleting pot:', err);
        setError('Failed to delete pot. Please try again.');
      }
    }
    setDeleteDialog({ open: false });
  };

  useEffect(() => {
    pots.forEach(pot => {
      if (pot.goalAmount > 0 && pot.balance >= pot.goalAmount) {
        const celebrationShown = localStorage.getItem(`goal-celebration-${pot._id}`);
        if (!celebrationShown) {
          setShowCelebration({
            show: true,
            potName: pot.name,
            goalAmount: pot.goalAmount
          });
          localStorage.setItem(`goal-celebration-${pot._id}`, 'true');
          notifyPotReward('goal-reached', pot.goalAmount, pot.name);
        }
      }
    });
  }, [pots]);

  if (loading || rtkLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-200 rounded mb-8"></div>
          <div className="h-12 w-32 bg-emerald-200 rounded"></div>
        </div>
        <p className="mt-4 text-gray-500">Connecting to backend server...</p>
      </div>
    );
  }

  if (error || rtkError) {
    const errorMessage = error || (rtkError?.data?.message || 'Failed to load data');

    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-slate-50 rounded-lg p-8">
        <h2 className="mb-4 text-2xl font-semibold text-red-500">
          Something went wrong
        </h2>
        <p className="mb-8 text-gray-600">
          {errorMessage}
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => refetch ? refetch() : fetchPots()}
            className="px-8 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reload Page
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg max-w-xl">
          <p className="text-sm text-red-700">
            <strong>Debug info:</strong> Make sure your backend server is running on port 9000 
            and the CORS settings allow requests from this frontend.
          </p>
        </div>
      </div>
    );
  }

  if (!pots || pots.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-white rounded-xl p-8 shadow-sm">
        <div className="mb-6 p-6 bg-emerald-50 rounded-full">
          <PiggyBank size={64} className="text-emerald-500" />
        </div>
        <h2 className="mb-4 text-3xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Create Your First Savings Pot
        </h2>
        <p className="mb-8 text-gray-600 max-w-md text-center">
          Start saving towards your goals with customized savings pots. Each pot can have its own target and purpose.
        </p>
        <button
          onClick={() => {
            onCreateNew();
            setTimeout(fetchPots, 1000);
          }}
          className="px-8 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
        >
          <PiggyBank size={20} />
          Create Pot
        </button>
      </div>
    );
  }

  const potsWithGoals = pots.filter(pot => pot.goalAmount > 0);
  const potsWithoutGoals = pots.filter(pot => pot.goalAmount === 0);
  const completedGoals = potsWithGoals.filter(pot => pot.balance >= pot.goalAmount);
  const activeGoals = potsWithGoals.filter(pot => pot.balance < pot.goalAmount);

  return (
    <>
      {potsWithGoals.length > 0 && (
        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer" 
            onClick={() => setVisibleSections(prev => ({ ...prev, activeGoals: !prev.activeGoals }))}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-800">Goals in Progress</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {activeGoals.length}
              </span>
            </div>
            <button className="text-gray-400">
              {visibleSections.activeGoals ? '−' : '+'}
            </button>
          </div>

          {visibleSections.activeGoals && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeGoals.map((pot) => {
                const category = POT_CATEGORIES.find(c => c.id === pot.category);
                const progress = Math.min((pot.balance / pot.goalAmount) * 100, 100);
                const timeLeft = calculateTimeToGoal(pot);

                return (
                  <div key={pot._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 rounded-xl bg-emerald-50">
                          {category?.icon || <PiggyBank size={24} className="text-emerald-500" />}
                        </div>
                        <div>
                          <h3 className="text-emerald-600 font-semibold text-[0.95rem] mb-1">
                            {pot.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {category?.name || 'Custom'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(pot)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-baseline mb-2">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{pot.balance.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        of ₹{pot.goalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 text-xs">
                          {timeLeft}
                        </span>
                        <span className="font-semibold text-xs text-emerald-500">
                          {progress.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onDeposit(pot)}
                          className="py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700"
                        >
                          Add Money
                        </button>
                        <button
                          onClick={() => onWithdraw(pot)}
                          disabled={pot.balance <= 0}
                          className="py-2 border border-emerald-500 text-emerald-500 rounded-lg text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-white"
                        >
                          Withdraw
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => onSetGoal(pot)}
                          className="text-xs text-gray-500 hover:text-emerald-500"
                        >
                          Update Goal
                        </button>
                        <button
                          onClick={() => onShowAiAssistant(pot)}
                          className="text-xs text-emerald-500 hover:text-emerald-600 font-medium"
                        >
                          Get Tips
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {completedGoals.length > 0 && (
                completedGoals.map((pot) => {
                  const category = POT_CATEGORIES.find(c => c.id === pot.category);
                  
                  return (
                    <div key={pot._id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-xs font-medium">
                        Completed
                      </div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="mr-4 p-2 rounded-xl bg-emerald-50">
                            {category?.icon || <PiggyBank size={24} className="text-emerald-500" />}
                          </div>
                          <div>
                            <h3 className="text-emerald-600 font-semibold text-[0.95rem] mb-1">
                              {pot.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {category?.name || 'Custom'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        ₹{pot.balance.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        Goal: ₹{pot.goalAmount.toLocaleString()}
                      </p>

                      <div className="mb-4">
                        <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <p className="text-center text-emerald-600 font-semibold mt-2 text-sm">
                          🎉 Goal Achieved!
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onWithdraw(pot)}
                          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700"
                        >
                          Withdraw
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pot)}
                          className="w-full py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
      
      {potsWithoutGoals.length > 0 && (
        <div>
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setVisibleSections(prev => ({ ...prev, noGoalPots: !prev.noGoalPots }))}
          >
            <div className="flex items-center gap-2">
              <BarChart size={20} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">General Savings</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {potsWithoutGoals.length}
              </span>
            </div>
            <button className="text-gray-400">
              {visibleSections.noGoalPots ? '−' : '+'}
            </button>
          </div>

          {visibleSections.noGoalPots && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {potsWithoutGoals.map((pot) => {
                const category = POT_CATEGORIES.find(c => c.id === pot.category);
                
                return (
                  <div key={pot._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 rounded-xl bg-blue-50">
                          {category?.icon || <PiggyBank size={24} className="text-blue-500" />}
                        </div>
                        <div>
                          <h3 className="text-blue-500 font-semibold text-[0.95rem] mb-1">
                            {pot.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {category?.name || 'Custom'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(pot)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      ₹{pot.balance.toLocaleString()}
                    </p>

                    <p className="mb-4 text-gray-500 italic text-center text-sm">
                      No goal set yet
                    </p>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onSetGoal(pot)}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Target size={20} />
                        Set Goal
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onDeposit(pot)}
                          className="py-2 border border-blue-500 text-blue-500 rounded-lg text-sm font-semibold hover:bg-blue-50"
                        >
                          Add Money
                        </button>
                        <button
                          onClick={() => onWithdraw(pot)}
                          disabled={pot.balance <= 0}
                          className="py-2 border border-gray-300 text-gray-500 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDeleteConfirm}
        potName={deleteDialog.potName || ''}
        balance={deleteDialog.balance || 0}
      />

      {showCelebration.show && (
        <GoalCompletionCelebration
          potName={showCelebration.potName}
          goalAmount={showCelebration.goalAmount}
          onComplete={() => {
            setShowCelebration(prev => ({ ...prev, show: false }));
            refetch();
          }}
        />
      )}
    </>
  );
};

const calculateTimeToGoal = (pot) => {
  if (!pot || pot.balance >= pot.goalAmount) return "Goal reached!";
  
  const remaining = pot.goalAmount - pot.balance;
  const monthlyRate = remaining * 0.1;
  const months = Math.ceil(remaining / monthlyRate);
  
  if (months < 1) return "Almost there!";
  if (months === 1) return "About 1 month left";
  if (months < 12) return `About ${months} months left`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `About ${years} year${years > 1 ? 's' : ''} left`;
  }
  
  return `About ${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''} left`;
};

export default PotGrid;
