import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useCreatePotMutation } from "../../state/api";
import { POT_CATEGORIES } from './constants/potCategories';
import SuccessAnimation from './SuccessAnimation';

const CategoryCard = ({ category, onClick }) => (
  <div
    onClick={onClick}
    className="p-6 text-center cursor-pointer transition-all duration-300 bg-white rounded-xl border-2 border-transparent h-full flex flex-col items-center hover:translate-y-[-4px] hover:border-[#10B981] hover:shadow-xl"
  >
    <div
      className="mb-2 p-2.5 rounded-xl bg-[#10B98115] text-[#10B981]"
    >
      <span className="text-4xl">
        {category.icon}
      </span>
    </div>
    <span 
      className="text-[#10B981] font-bold mb-1 text-lg"
    >
      {category.name}
    </span>
    {category.description && (
      <p 
        className="text-gray-500 text-sm leading-tight"
      >
        {category.description}
      </p>
    )}
  </div>
);

const CreatePotDialog = ({ 
  open, 
  onClose, 
  onSuccess,
  potCategories 
}) => {
  const [createPot] = useCreatePotMutation();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [potName, setPotName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    setStep(1);
    setSelectedCategory('');
    setPotName('');
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPot({
        name: potName,
        category: selectedCategory
      }).unwrap();
      setShowSuccess(true);
      // Success message will be shown via animation
      setTimeout(() => {
        handleClose();
        onSuccess('Pot created successfully!');
      }, 2000);
    } catch (error) {
      console.error('Error creating pot:', error);
      onSuccess('Failed to create pot');
    }
  };

  if (!open) return null;

  if (showSuccess) {
    return (
      <SuccessAnimation
        title="Pot Created Successfully! 🎉"
        subtitle="Your new savings journey begins now"
        onComplete={() => {
          setShowSuccess(false);
          onClose();
          onSuccess('New savings pot created successfully');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="animate-fadeIn" style={{animationDuration: '500ms'}}>
        {step === 1 ? (
          // Category selection step
          <div className={`bg-[#F8FAFC] rounded-xl max-h-[90vh] overflow-y-auto ${step === 1 ? 'w-full max-w-4xl' : 'w-full max-w-md'}`}>
            <div className="p-2 flex items-center gap-2 border-b border-gray-200 bg-white sticky top-0 z-10">
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  className="p-2 rounded-full hover:bg-[#F1F5F9]"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h2 className="flex-1 font-semibold text-lg">
                {step === 1 ? 'Choose Pot Category' : 'Name Your Pot'}
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-[#F1F5F9]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h1 
                className="text-center mb-1 font-bold text-xl"
              >
                What are you saving for?
              </h1>
              <p 
                className="text-center text-gray-500 mb-8"
              >
                Choose a category for your savings pot
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {POT_CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setStep(2);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Name your pot step
          <div className="w-full max-w-md p-0">
            <div
              className="rounded-2xl shadow-2xl backdrop-blur-xl bg-white bg-opacity-90 relative overflow-hidden"
            >
              {/* Header */}
              <div className="p-2 flex items-center gap-2 border-b border-gray-200">
                <button 
                  onClick={() => setStep(1)}
                  className="p-2 rounded-full hover:bg-[#F1F5F9]"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="flex-1 font-semibold text-lg">
                  Name Your Pot
                </h2>
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-[#F1F5F9]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Selected Category Preview */}
                <div
                  className="mb-8 flex items-center justify-center flex-col gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-xl bg-[#10B98115] flex items-center justify-center"
                  >
                    <span className="text-4xl">
                      {POT_CATEGORIES.find(c => c.id === selectedCategory)?.icon}
                    </span>
                  </div>
                  <p className="text-gray-500">
                    {POT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Pot
                  </p>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <label htmlFor="potName" className="block text-sm font-medium text-gray-700 mb-1">Name your pot</label>
                  <input
                    id="potName"
                    type="text"
                    value={potName}
                    onChange={(e) => setPotName(e.target.value)}
                    placeholder="e.g., Dream Holiday"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] hover:border-[#10B981]"
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!potName}
                  className={`w-full py-3 rounded-lg text-base text-white font-medium ${!potName ? 'bg-gray-300' : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]'}`}
                >
                  Create {POT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Pot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePotDialog;