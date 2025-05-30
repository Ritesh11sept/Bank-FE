import React from 'react';
import { X, Shield, Target, BarChart, Award } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const AboutModal = ({ isOpen, onClose }) => {
  const { translations } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] md:max-h-[90vh] lg:max-h-[95vh] lg:max-w-4xl xl:max-w-5xl shadow-xl animate-in fade-in zoom-in overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with emerald gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{translations.about.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 flex-grow">
          <div className="prose max-w-none">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {translations.about.description}
            </p>
            
            {/* Mission section */}
            <div className="my-4 sm:my-6 p-3 sm:p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
              <h3 className="text-emerald-700 font-semibold mb-2">{translations.about.mission.title}</h3>
              <p className="text-gray-700">
                {translations.about.mission.description}
              </p>
            </div>
            
            {/* Features section */}
            <h3 className="text-emerald-800 font-semibold mt-4 sm:mt-6 mb-3 sm:mb-4">{translations.about.features.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-emerald-100 p-2 rounded-full">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">{translations.about.features.integration.title}</p>
                  <p className="text-sm text-gray-500">{translations.about.features.integration.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-emerald-100 p-2 rounded-full">
                  <BarChart className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">{translations.about.features.analytics.title}</p>
                  <p className="text-sm text-gray-500">{translations.about.features.analytics.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-emerald-100 p-2 rounded-full">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">{translations.about.features.savings.title}</p>
                  <p className="text-sm text-gray-500">{translations.about.features.savings.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-emerald-100 p-2 rounded-full">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">{translations.about.features.rewards.title}</p>
                  <p className="text-sm text-gray-500">{translations.about.features.rewards.description}</p>
                </div>
              </div>
            </div>
            
            {/* Security section */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-emerald-800 font-semibold mb-2">{translations.about.security.title}</h3>
                  <p className="text-gray-700 text-sm">
                    {translations.about.security.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with button */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 text-sm sm:text-base"
          >
            {translations.about.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;