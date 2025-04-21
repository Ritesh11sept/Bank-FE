import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { motion } from 'framer-motion';

const CircleRow = () => (
  <div className="flex justify-center gap-2 mb-1">
    <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
    <div className="w-4 h-4 rounded-full bg-purple-400"></div>
    <div className="w-4 h-4 rounded-full bg-orange-400"></div>
    <div className="w-4 h-4 rounded-full bg-red-400"></div>
    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-xs font-medium text-slate-600">
      100K+
    </div>
  </div>
);

const HeroContent = () => {
  const { translations } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[2.5rem] p-8 md:p-16 text-center">
      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i === 4 ? 'text-gray-300' : 'text-yellow-400'}`}
            fill={i === 4 ? 'rgb(209 213 219)' : 'rgb(250 204 21)'}
          />
        ))}
        <span className="ml-2 text-white">4.9/5</span>
      </div>

      <CircleRow />

      <p className="text-gray-400 text-sm mb-6 md:mb-8">
        {translations.footer.usersCount}
      </p>

      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
        {translations.footer.heroTitle}
      </h1>

      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        {translations.footer.heroDescription}
      </p>

      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto transition-colors group">
        {translations.footer.getStarted}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

const Footer = () => {
  const { translations, language } = useTranslation();

  const socialLinks = [
    {
      name: 'linkedin',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.5 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-1 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zm-15.4 0H1.7V9h3.4v11.5zM3.4 7.5C1.9 7.5.7 6.3.7 4.8s1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7z" />
        </svg>
      ),
    },
    {
      name: 'twitter',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.9 4.1c-.8.4-1.8.6-2.7.7 1-.6 1.7-1.5 2-2.6-.9.5-2 .9-3 1.1-.9-1-2.2-1.5-3.6-1.5-2.7 0-4.8 2.2-4.8 4.8 0 .4 0 .8.1 1.1-4-.2-7.6-2.1-10-5C1 3.5.8 4.6.8 5.8c0 1.6.8 3.1 2.1 4-.8 0-1.5-.2-2.2-.6 0 2.3 1.7 4.2 3.9 4.7-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 1.9 2.4 3.3 4.5 3.3-1.6 1.3-3.7 2-5.9 2-.4 0-.8 0-1.1-.1 2.1 1.3 4.6 2.1 7.3 2.1 8.8 0 13.6-7.3 13.6-13.6v-.6c.9-.7 1.7-1.5 2.4-2.5z" />
        </svg>
      ),
    },
    {
      name: 'facebook',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 8H6v4h3v12h5V12h3.6l.4-4h-4V6.3c0-1 .3-1.3 1.3-1.3H18V0h-3.8C9.7 0 9 2.9 9 6v2z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-slate-900 text-gray-400">
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'ellipse(70% 100% at 50% 0%)' }}></div>
      </div>

      <div className="pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-gray-800">
            <div className="md:max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">₹</span>
                </div>
                <div>
                  <span className="text-white text-xl font-bold">FinanceSeer</span>
                  <p className="text-emerald-400 text-xs">
                    {language === 'english' ? 'Smart Financial Insights' : 'स्मार्ट वित्तीय अंतर्दृष्टि'}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-6 leading-relaxed">{translations.footer.companyDescription}</p>

              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={`#${social.name}`}
                    className="w-8 h-8 bg-slate-800 hover:bg-emerald-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12 lg:gap-16">
              <div>
                <h3 className="text-white font-semibold mb-4">{translations.footer.features.title}</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.features.panIntegration}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.features.analytics}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.features.marketInsights}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">{translations.footer.company.title}</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.company.about}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.company.privacy}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm hover:text-emerald-400 transition-colors">
                      {translations.footer.company.terms}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm">© 2024 FinanceSeer. {translations.footer.allRightsReserved}</p>

            <motion.div
              className="text-xs bg-slate-800 rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 self-start sm:self-auto"
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{language === 'english' ? 'EN' : 'हिंदी'}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CombinedComponent = () => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <HeroContent />
      </div>
      <Footer />
    </div>
  );
};

export default CombinedComponent;