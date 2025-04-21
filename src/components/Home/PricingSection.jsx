import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const PricingCard = ({ title, description, price, features, isPopular }) => {
  const { translations } = useTranslation();
  
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-3xl relative">
      <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">₹{price}</span>
        <span className="text-gray-400 text-sm ml-1">{translations.pricing.perMonth}</span>
      </div>
      
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors">
        {translations.pricing.selectPlan}
      </button>
    </div>
  );
};

const PricingSection = () => {
  const { translations } = useTranslation();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    starter: {
      title: translations.pricing.plans.basic.title,
      description: translations.pricing.plans.basic.description,
      monthlyPrice: "0",
      yearlyPrice: "0",
      features: translations.pricing.plans.basic.features
    },
    growth: {
      title: translations.pricing.plans.smart.title,
      description: translations.pricing.plans.smart.description,
      monthlyPrice: "299",
      yearlyPrice: "2999",
      features: translations.pricing.plans.smart.features
    },
    business: {
      title: translations.pricing.plans.wealth.title,
      description: translations.pricing.plans.wealth.description,
      monthlyPrice: "699",
      yearlyPrice: "6999",
      features: translations.pricing.plans.wealth.features
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
            {translations.pricing.sectionTitle}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {translations.pricing.heading}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {translations.pricing.subheading}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/40 p-1 rounded-full">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              {translations.pricing.monthly}
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              {translations.pricing.yearly}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([key, plan]) => (
            <PricingCard
              key={key}
              title={plan.title}
              description={plan.description}
              price={billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
              features={plan.features}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
