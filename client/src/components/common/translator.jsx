import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const newLang = e.target.value;
    if (newLang !== i18n.language) {
      setSelectedLang(newLang);
      setShowModal(true);
    }
  };

  const confirmChange = () => {
    i18n.changeLanguage(selectedLang);
    setShowModal(false);

  };

  const cancelChange = () => {
    setSelectedLang(i18n.language);
    setShowModal(false);
  };

  return (
    <>
      <select
        value={i18n.language}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
      </select>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "16px", fontSize: "16px" }}>
              {t("confirm_language_change")}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button
                onClick={cancelChange}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e5e5e5",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmChange}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;
