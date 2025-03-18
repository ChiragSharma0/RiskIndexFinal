import React, { useContext, memo, useEffect } from "react";
import "./input.css";
import LanguageSelector from "../../components/common/translator.jsx";

const AuthPage = ({ children }) => {
  const savedLanguage = localStorage.getItem("appLanguage") || "en";

  useEffect(() => {
    console.log("✅ AuthPage mounted");
    console.log("🌐 Saved Language from localStorage:", savedLanguage);

    return () => {
      console.log("❌ AuthPage unmounted");
    };
  }, []);



  return (
    <div className="Authbody">
      <header>
        <label>
          choose your language
          <LanguageSelector />
        </label>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default memo(AuthPage);
