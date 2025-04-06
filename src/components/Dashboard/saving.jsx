import React, { useState } from 'react';
import DashboardLayout from "./DashboardLayout";
import { Plus, Info } from 'lucide-react';
import { useGetPotsQuery, useDeletePotMutation } from "../state/api";
import { POT_CATEGORIES } from '../scenes/savings/constants/potCategories';
import AboutPotsDialog from '../scenes/savings/AboutPotsDialog';
import CreatePotDialog from '../scenes/savings/CreatePotDialog';
import TransactionDialog from '../scenes/savings/TransactionDialogs';
import SetGoalDialog from '../scenes/savings/SetGoalDialog';
import PotGrid from '../scenes/savings/PotGrid';

// StatsCard component with Tailwind
const StatsCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
    <p className="mb-2 text-gray-600 text-sm font-medium">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const Savings = () => {
  const { data: pots = [], isLoading, error: queryError } = useGetPotsQuery();
  const [deletePot] = useDeletePotMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleDeletePot = async (potId) => {
    try {
      await deletePot(potId).unwrap();
      showAlert('Pot deleted successfully', 'success');
    } catch (error) {
      showAlert(error?.data?.message || 'Failed to delete pot', 'error');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = POT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Custom';
  };

  const getCategoryColor = (categoryId) => {
    const category = POT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : '#757575';
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full p-5 md:p-7 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-64px)]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              Savings Pots
            </h1>
            <p className="text-gray-600 flex items-center gap-2 text-sm">
              <Info size={16} />
              Each pot earns 2.5% interest annually
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsAboutDialogOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              About Pots
            </button>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Pot
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          <StatsCard 
            label="Total Savings"
            value={`₹${pots.reduce((sum, pot) => sum + pot.balance, 0).toLocaleString()}`}
          />
          <StatsCard 
            label="Active Pots"
            value={pots.length}
          />
          <StatsCard 
            label="Total Goals"
            value={pots.filter(pot => pot.goalAmount > 0).length}
          />
          <StatsCard 
            label="Interest Earned"
            value={`₹${(pots.reduce((sum, pot) => sum + pot.balance, 0) * 0.025).toFixed(2)}`}
          />
        </div>

        {/* Main Content - Pots Grid */}
        {isLoading ? (
          <div className="p-6 text-center bg-white rounded-2xl shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Loading your savings pots...</p>
          </div>
        ) : queryError ? (
          <div className="p-8 text-center bg-white rounded-2xl shadow-sm">
            <p className="text-red-500">
              {typeof queryError === 'string' ? queryError : 'Failed to load pots'}
            </p>
          </div>
        ) : (
          <PotGrid
            pots={pots}
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
            getCategoryName={getCategoryName}
            getCategoryColor={getCategoryColor}
          />
        )}

        {/* Dialogs */}
        <CreatePotDialog 
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          potCategories={POT_CATEGORIES}
        />

        <TransactionDialog 
          type="deposit"
          open={isDepositDialogOpen}
          onClose={() => setIsDepositDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <TransactionDialog 
          type="withdraw"
          open={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.amount}
          onAmountChange={handleInputChange}
        />

        <TransactionDialog 
          type="goal"
          open={isGoalDialogOpen}
          onClose={() => setIsGoalDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          amount={formData.goalAmount}
          onAmountChange={handleInputChange}
        />

        <SetGoalDialog 
          open={isGoalDialogOpen}
          onClose={() => setIsGoalDialogOpen(false)}
          onSuccess={(message) => showAlert(message, 'success')}
          selectedPot={selectedPot}
          goalAmount={formData.goalAmount}
          onGoalAmountChange={handleInputChange}
        />

        <AboutPotsDialog 
          open={isAboutDialogOpen}
          onClose={() => setIsAboutDialogOpen(false)}
        />

        {/* Alert */}
        {alert.open && (
          <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-lg ${
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