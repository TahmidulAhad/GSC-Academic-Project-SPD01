
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { translations } from '../lib/translations';

type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useTranslation must be used within an AppProvider');
  }

  const { language } = context;

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['en'][key];
  };

  return { t, language: context.language, toggleLanguage: context.toggleLanguage };
};
