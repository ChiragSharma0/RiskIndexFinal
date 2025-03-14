import React, { createContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const storedLanguage = localStorage.getItem("appLanguage") || "en";
  const [language, setLanguage] = useState(storedLanguage);
  const translations = language === "hi" ? hi : en;

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
    applyGoogleTranslate(language);
  }, [language]);

  const applyGoogleTranslate = (lang) => {
    const googleLang = lang === "en" ? "/en/en" : `/en/${lang}`;
    document.cookie = `googtrans=${googleLang}; path=/; domain=${window.location.hostname}`;

    if (window.google) {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    }
  };

  // 🔹 Inject Google Translate script once on initial load
  useEffect(() => {
    console.log("📦 Injecting Google Translate script...");

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      console.log("✅ Google Translate initialized");
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    return () => {
      console.log("🧹 Cleaning up Google Translate script");
      // Optional: remove the script if you want
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      <>
        {/* 🔹 Hidden Google Translate Widget */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        {children}
      </>
    </LanguageContext.Provider>
  );
}
