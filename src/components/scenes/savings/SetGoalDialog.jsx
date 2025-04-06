import React from 'react';
import { X, Target } from 'lucide-react';
import { useUpdatePotGoalMutation } from "../../state/api";
import { POT_CATEGORIES } from './constants/potCategories';

const SetGoalDialog = ({
  open,
  onClose,
  onSuccess,
  selectedPot,
  goalAmount,
  onGoalAmountChange
}) => {
  const [updatePotGoal] = useUpdatePotGoalMutation();
  const category = POT_CATEGORIES.find(c => c.id === selectedPot?.category);

  const handleSubmit = async () => {
    try {
      if (!selectedPot?._id || goalAmount <= 0) return;
      
      await updatePotGoal({
        potId: selectedPot._id,
        data: { goalAmount: Number(goalAmount) }
      }).unwrap();
      
      onSuccess(`Goal ${selectedPot.goalAmount ? 'updated' : 'set'} successfully!`);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      onSuccess(error?.data?.message || 'Operation failed');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-visible animate-fade-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6 gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Target size={20} />
            </div>
            <h2 className="flex-1 text-xl font-semibold">
              {selectedPot?.goalAmount ? 'Update Goal' : 'Set Goal'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Pot Info */}
          <div className="p-5 mb-6 bg-slate-50 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{category?.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPot?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category?.name} Pot
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-base font-semibold">
                ₹{selectedPot?.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Goal Amount Input */}
          <div className="mb-6">
            <input
              type="number"
              name="goalAmount"
              placeholder="Enter goal amount"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              value={goalAmount === 0 ? '' : goalAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onGoalAmountChange({ ...e, target: { ...e.target, value: '0', name: 'goalAmount' } });
                } else if (Number(value) >= 0) {
                  onGoalAmountChange(e);
                }
              }}
              onFocus={(e) => e.target.select()}
              min="0"
              step="any"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!goalAmount || goalAmount <= 0}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {selectedPot?.goalAmount ? 'Update Goal' : 'Set Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetGoalDialog;
