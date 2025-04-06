import React, { useState } from 'react';
import { X, Target, Plus, Minus } from 'lucide-react';
import { useDepositToPotMutation, useWithdrawFromPotMutation } from "../../state/api";
import { POT_CATEGORIES } from './constants/potCategories';
import GoalCompletionCelebration from './GoalCompletionCelebration';

const TransactionDialog = ({
  type,
  open,
  onClose,
  onSuccess,
  selectedPot,
  amount,
  onAmountChange
}) => {
  const [depositToPot] = useDepositToPotMutation();
  const [withdrawFromPot] = useWithdrawFromPotMutation();
  const [showCelebration, setShowCelebration] = useState(false);
  
  const category = POT_CATEGORIES.find(c => c.id === selectedPot?.category);

  const dialogConfig = {
    deposit: {
      title: 'Add Money',
      icon: <Plus size={20} />,
      color: '#10B981',
      bgColor: 'bg-green-50',
      textColor: 'text-green-500',
      buttonClasses: 'bg-green-500 hover:bg-green-600',
      label: 'Amount to Add (₹)',
      buttonText: 'Add Money',
      action: async () => {
        await depositToPot({ id: selectedPot?._id, amount }).unwrap();
        if (selectedPot?.goalAmount && 
            (selectedPot.balance + Number(amount)) >= selectedPot.goalAmount) {
          setShowCelebration(true);
        } else {
          onSuccess(`Successfully added ₹${amount} to ${selectedPot?.name}`);
          onClose();
        }
      }
    },
    withdraw: {
      title: 'Withdraw Money',
      icon: <Minus size={20} />,
      color: '#EF4444',
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
      buttonClasses: 'bg-red-500 hover:bg-red-600',
      label: 'Amount to Withdraw (₹)',
      buttonText: 'Withdraw Money',
      action: async () => {
        await withdrawFromPot({ id: selectedPot?._id, amount }).unwrap();
        onSuccess(`Successfully withdrawn ₹${amount} from ${selectedPot?.name}`);
        onClose();
      }
    },
    goal: {
      title: 'Set Goal',
      icon: <Target size={20} />,
      color: '#6366F1',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-500',
      buttonClasses: 'bg-indigo-500 hover:bg-indigo-600',
      label: 'Goal Amount (₹)',
      buttonText: 'Set Goal',
      action: async () => {
        onClose();
      }
    }
  };

  // Ensure we have a valid type
  const config = dialogConfig[type] || dialogConfig.deposit;

  const handleAction = async () => {
    try {
      if (!selectedPot?._id || amount <= 0) return;
      await config.action();
    } catch (error) {
      console.error('Error:', error);
      onSuccess(error?.data?.message || 'Operation failed');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-visible transition-opacity duration-300 ease-in-out">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6 gap-4">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} ${config.textColor} flex items-center justify-center`}>
              {config.icon}
            </div>
            <h2 className="text-lg font-semibold flex-1">
              {config.title}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Pot Info */}
          <div className="p-5 mb-6 bg-slate-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl">{category?.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedPot?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category?.name} Pot
                </p>
              </div>
            </div>
            <div className="flex gap-6 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">
                  Current Balance
                </p>
                <p className="text-base font-semibold">
                  ₹{selectedPot?.balance.toLocaleString()}
                </p>
              </div>
              {selectedPot?.goalAmount > 0 && (
                <div>
                  <p className="text-sm text-gray-500">
                    Goal Amount
                  </p>
                  <p className="text-base font-semibold">
                    ₹{selectedPot.goalAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
              {config.label}
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
              value={amount === 0 ? '' : amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onAmountChange({ ...e, target: { ...e.target, value: '0' } });
                } else if (Number(value) >= 0) {
                  onAmountChange(e);
                }
              }}
              onFocus={(e) => e.target.select()}
              min={0}
              step="any"
              inputMode="numeric"
              pattern="[0-9]*"
              max={type === 'withdraw' ? selectedPot?.balance : undefined}
              autoComplete="off"
              placeholder="Enter amount"
            />
          </div>

          {/* Action Button */}
          <button
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${config.buttonClasses} ${
              amount <= 0 || (type === 'withdraw' && amount > (selectedPot?.balance || 0))
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleAction}
            disabled={amount <= 0 || (type === 'withdraw' && amount > (selectedPot?.balance || 0))}
          >
            {config.buttonText}
          </button>
        </div>
        {showCelebration && selectedPot && (
          <GoalCompletionCelebration
            potName={selectedPot.name}
            goalAmount={selectedPot.goalAmount}
            onComplete={() => {
              setShowCelebration(false);
              onClose();
              onSuccess(`Successfully added ₹${amount} to ${selectedPot.name} and completed your goal!`);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionDialog;