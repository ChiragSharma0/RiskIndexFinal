import React, { createContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // 🔹 Get stored language from localStorage or default to English
    const storedLanguage = localStorage.getItem("appLanguage") || "en";
    const [language, setLanguage] = useState(storedLanguage);
    const translations = language === "hi" ? hi : en;

    // 🔹 Save language in localStorage & update Google Translate
    useEffect(() => {
        localStorage.setItem("appLanguage", language);
        applyGoogleTranslate(language);
    }, [language]);

    // 🔹 Function to update Google Translate
    const applyGoogleTranslate = (lang) => {
        const googleLang = lang === "en" ? "/en/en" : `/en/${lang}`;
        document.cookie = `googtrans=${googleLang}; path=/; domain=${window.location.hostname}`;
        
        // ✅ Reload Google Translate script
        if (window.google) {
            new window.google.translate.TranslateElement(
                { pageLanguage: "en", autoDisplay: false },
                "google_translate_element"
            );
        }
    };

    return (
        <LanguageContext.Provider value={{ translations, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}
