import React, { useContext, memo, useEffect } from "react";
import { LanguageContext } from "../../context/TranslatorContext.jsx";
import "./input.css";
import LanguageSelector from "../../components/common/translator.jsx";

const AuthPage = ({ children }) => {
  const { translations, setLanguage, language } = useContext(LanguageContext);
  const savedLanguage = localStorage.getItem("appLanguage") || "en";

  useEffect(() => {
    console.log("✅ AuthPage mounted");
    console.log("🌐 Saved Language from localStorage:", savedLanguage);

    return () => {
      console.log("❌ AuthPage unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("🌍 Current language in context:", language);
  }, [language]);

  return (
    <div className="Authbody">
      <header>
        <label>
          {translations.choose} {translations.language}:
          <LanguageSelector />
        </label>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default memo(AuthPage);
