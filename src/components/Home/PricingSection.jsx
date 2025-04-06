import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ title, description, price, features, isPopular }) => (
  <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-3xl relative">
    <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    
    <div className="mb-6">
      <span className="text-4xl font-bold text-white">₹{price}</span>
      <span className="text-gray-400 text-sm ml-1">/per month</span>
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
      Select This Plan
    </button>
  </div>
);

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    starter: {
      title: "Basic Insights",
      description: "Perfect for individual users starting their financial journey",
      monthlyPrice: "0",
      yearlyPrice: "0",
      features: [
        "PAN-based Account Integration",
        "Basic Spending Analytics",
        "Transaction Monitoring",
        "2 Saving Pots",
        "Basic Market Updates"
      ]
    },
    growth: {
      title: "Smart Saver",
      description: "Ideal for users seeking advanced financial insights",
      monthlyPrice: "299",
      yearlyPrice: "2999",
      features: [
        "Everything in Basic Plan",
        "Advanced Analytics Dashboard",
        "Personalized Financial Advice",
        "Unlimited Saving Pots",
        "Premium Rewards Program"
      ]
    },
    business: {
      title: "Wealth Manager",
      description: "Complete financial management suite with premium features",
      monthlyPrice: "699",
      yearlyPrice: "6999",
      features: [
        "Everything in Smart Saver",
        "AI-Powered Investment Tips",
        "Priority Customer Support",
        "Custom Financial Reports",
        "Advanced Market Insights"
      ]
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Pricing Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select a plan that will empower your business growth
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each package includes GST compliance tools and personalized support to ensure your success
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
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
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
