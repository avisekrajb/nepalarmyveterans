import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

const detectCountryFromIP = async () => {
  const providers = [
    'https://ipapi.co/json/',
    'https://ipwho.is/',
    'https://ip-api.com/json/?fields=countryCode',
  ];
  for (const url of providers) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const code = (data.country_code || data.countryCode || '').toUpperCase();
      if (code) return code;
    } catch (e) {
      /* try next provider */
    }
  }
  return null;
};

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const appliedOnce = useRef(false);

  const language = i18n.language?.split('-')[0] || 'en';
  const isNepali = language === 'ne';
  const isEnglish = language === 'en';

  const setLanguage = useCallback((lang) => {
    i18n.changeLanguage(lang);
    // Manual choice is stored separately so IP auto-detect only runs
    // when the user has not explicitly picked a language.
    localStorage.setItem('languageManual', lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  useEffect(() => {
    // If the user has ever manually chosen a language, respect it.
    // Otherwise auto-detect from the visitor's IP (Nepali in Nepal, English abroad).
    if (localStorage.getItem('languageManual')) return;

    let cancelled = false;
    detectCountryFromIP().then((countryCode) => {
      if (cancelled) return;
      // Nepal country code is "NP"; fall back to Nepali if detection fails too.
      const lang = countryCode === 'NP' ? 'ne' : 'en';
      if (!appliedOnce.current) {
        appliedOnce.current = true;
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
      }
    });
    return () => { cancelled = true; };
  }, [i18n]);

  const toggleLanguage = useCallback(() => {
    setLanguage(isNepali ? 'en' : 'ne');
  }, [isNepali, setLanguage]);

  const localize = useCallback((obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const en = obj.en || obj.ne || obj.title || obj.content || '';
    const ne = obj.ne || obj.en || obj.title || obj.content || '';
    return isNepali ? ne : en;
  }, [isNepali]);

  const getLocalizedField = useCallback((item, field) => {
    if (!item) return '';
    const enVal = item[`${field}En`];
    const neVal = item[`${field}Ne`];
    const plainVal = item[field];

    const en = enVal || neVal || plainVal || '';
    const ne = neVal || enVal || plainVal || '';

    return isNepali ? ne : en;
  }, [isNepali]);

  return (
    <LanguageContext.Provider value={{
      language,
      isNepali,
      isEnglish,
      setLanguage,
      toggleLanguage,
      localize,
      getLocalizedField,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
