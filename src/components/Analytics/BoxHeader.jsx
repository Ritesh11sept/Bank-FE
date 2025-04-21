import React, { useContext } from 'react';
import { TranslationContext2 } from '../../context/TranslationContext2';

const BoxHeader = ({ title, subtitle, sideText, icon }) => {
  const { translations, language } = useContext(TranslationContext2) || { translations: {}, language: 'english' };
  
  // Get translations for analytics component
  const t = translations.analytics?.[language] || translations.analytics?.english || {};
  
  // Use translations if available, otherwise use props
  const translatedTitle = t[title] || title;
  const translatedSubtitle = t[subtitle] || subtitle;
  const translatedSideText = t[sideText] || sideText;
  
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-base font-medium text-emerald-800">{translatedTitle}</h3>
        {subtitle && <p className="text-xs text-emerald-600 mt-1">{translatedSubtitle}</p>}
      </div>
      <div className="flex items-center">
        {sideText && <span className="text-sm font-medium text-emerald-700">{translatedSideText}</span>}
        {icon && <span className="ml-2">{icon}</span>}
      </div>
    </div>
  );
};

export default BoxHeader;
