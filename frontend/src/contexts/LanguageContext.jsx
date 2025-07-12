import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (lang) => {
    try {
      setIsLoading(true);
      const translations = await import(`../locales/${lang}.json`);
      setT(translations.default || {});
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if translation fails
      if (lang !== 'en') {
        try {
          const enTranslations = await import('../locales/en.json');
          setT(enTranslations.default || {});
        } catch (e) {
          console.error('Failed to load fallback translations:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load saved language preference from localStorage or use browser language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      loadTranslations(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru'].includes(browserLang)) {
        loadTranslations(browserLang);
      } else {
        // Default to English
        loadTranslations('en');
      }
    }
  }, [loadTranslations]);

  const changeLanguage = async (lang) => {
    await loadTranslations(lang);
  };

  const contextValue = {
    language,
    t,
    changeLanguage,
    isLoading
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// For backward compatibility
export default LanguageContext;
