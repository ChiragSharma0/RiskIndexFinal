import React, { useContext, memo, useEffect } from "react";
import { LanguageContext } from "../../context/TranslatorContext";
import "./input.css";

const AuthPage = ({ children }) => {
    const { translations, setLanguage } = useContext(LanguageContext);
    const savedLanguage = localStorage.getItem("appLanguage") || "en";

    // 🔹 Load Google Translate on component mount
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { pageLanguage: "en", autoDisplay: false },
                "google_translate_element"
            );
        };
    }, []);

    return (
        <div className="Authbody">
            <header>
                <label>{translations.choose} {translations.language}:</label>
                <select
                    value={savedLanguage}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="language-selector"
                >
                    <option value="en">🇬🇧 {translations.english}</option>
                    <option value="hi">🇮🇳 {translations.hindi}</option>
                </select>
            </header>

            {/* 🔹 Hidden Google Translate Widget */}
            <div id="google_translate_element" style={{ display: "none" }}></div>

            <main>{children}</main>
        </div>
    );
};

export default memo(AuthPage);
