import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, translateText } from './languageService';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  getText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  getText: (text: string) => text,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('surakshit_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('surakshit_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][currentLanguage]) {
      return translations[key][currentLanguage];
    }
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    if (fallback) {
      return translateText(fallback, currentLanguage);
    }
    return key;
  };

  const getText = (text: string): string => {
    return translateText(text, currentLanguage);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
