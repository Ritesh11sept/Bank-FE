import React, { useEffect, useState } from 'react';
import { Target, Trash2, X } from 'lucide-react';
import { POT_CATEGORIES } from '../savings/constants/potCategories';
import GoalCompletionCelebration from '../savings/GoalCompletionCelebration';

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
  pots,
  onDeposit,
  onWithdraw,
  onSetGoal,
  onDelete,
  onCreateNew
}) => {
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

  const handleDeleteClick = (pot) => {
    setDeleteDialog({
      open: true,
      potId: pot._id,
      potName: pot.name,
      balance: pot.balance
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.potId) {
      onDelete(deleteDialog.potId);
    }
    setDeleteDialog({ open: false });
  };

  useEffect(() => {
    // Check if any pot has just reached its goal
    pots.forEach(pot => {
      if (pot.goalAmount > 0 && pot.balance >= pot.goalAmount) {
        // Only show celebration if we haven't shown it before for this pot
        const celebrationShown = localStorage.getItem(`goal-celebration-${pot._id}`);
        if (!celebrationShown) {
          setShowCelebration({
            show: true,
            potName: pot.name,
            goalAmount: pot.goalAmount
          });
          // Mark this celebration as shown
          localStorage.setItem(`goal-celebration-${pot._id}`, 'true');
        }
      }
    });
  }, [pots]);

  if (!pots || pots.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-slate-50 rounded-lg p-8">
        <h2 className="mb-4 text-3xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Create Your First Savings Pot
        </h2>
        <p className="mb-8 text-gray-600">
          Start saving towards your goals with customized savings pots
        </p>
        <button
          onClick={onCreateNew}
          className="px-8 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          Create Pot
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pots.map((pot) => {
          const category = POT_CATEGORIES.find(c => c.id === pot.category);
          const hasGoal = pot.goalAmount > 0;
          const progress = hasGoal ? Math.min((pot.balance / pot.goalAmount) * 100, 100) : 0;
          
          return (
            <div key={pot._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="mr-4 p-2 rounded-lg bg-emerald-50">
                    {category?.icon}
                  </div>
                  <div>
                    <h3 className="text-emerald-500 font-semibold text-[0.95rem] mb-1">
                      {pot.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {category?.name}
                    </p>
                  </div>
                </div>
                {hasGoal && (
                  <button
                    onClick={() => handleDeleteClick(pot)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="text-2xl font-bold text-gray-900 mb-4">
                ₹{pot.balance.toLocaleString()}
              </p>

              {hasGoal ? (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Goal: ₹{pot.goalAmount.toLocaleString()}
                    </span>
                    <span className={`font-semibold text-sm ${progress >= 100 ? 'text-emerald-700' : 'text-emerald-500'}`}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="h-1.5 bg-emerald-50 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        progress >= 100 
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {progress >= 100 && (
                    <p className="text-center text-emerald-600 font-semibold mt-2 text-sm">
                      🎉 Goal Achieved!
                    </p>
                  )}
                </div>
              ) : (
                <p className="mb-4 text-gray-500 italic text-center text-sm">
                  Set a goal to start tracking progress
                </p>
              )}

              <div className="flex flex-col gap-2">
                {hasGoal ? (
                  <>
                    <button
                      onClick={() => onDeposit(pot)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => onWithdraw(pot)}
                      disabled={pot.balance <= 0}
                      className="w-full py-2 border border-emerald-500 text-emerald-500 rounded-lg text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50"
                    >
                      Withdraw
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSetGoal(pot)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-emerald-700"
                    >
                      <Target size={20} />
                      Set Goal
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pot)}
                      className="w-full py-2 border border-red-500 text-red-500 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                      Delete Pot
                    </button>
                  </>
                )}
              </div>

              {hasGoal && (
                <button
                  onClick={() => onSetGoal(pot)}
                  className="w-full mt-2 text-gray-500 text-sm hover:text-emerald-500"
                >
                  Update Goal
                </button>
              )}
            </div>
          );
        })}
      </div>

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
          onComplete={() => setShowCelebration(prev => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
};

export default PotGrid;
