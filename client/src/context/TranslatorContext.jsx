import React, { createContext, useEffect, useState } from "react";

import en from "../locales/en.json";
import hi from "../locales/hi.json";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(en); // default to English

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLanguage(savedLang);
    loadTranslations(savedLang);
  }, []);

  const loadTranslations = (lang) => {
    switch (lang) {
      case "hi":
        setTranslations(hi);
        break;
      case "en":
      default:
        setTranslations(en);
        break;
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    loadTranslations(lang);
  };

  const t = (key) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
