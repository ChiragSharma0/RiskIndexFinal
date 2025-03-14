import React, { useContext, useState } from "react";
import { LanguageContext } from "../../context/TranslatorContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [selectedLang, setSelectedLang] = useState(language);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const newLang = e.target.value;
    if (newLang !== language) {
      setSelectedLang(newLang);
      setShowModal(true);
    }
  };

  const confirmChange = () => {
    setLanguage(selectedLang);
    setShowModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const cancelChange = () => {
    setSelectedLang(language);
    setShowModal(false);
  };

  return (
    <>
      <select
        value={language}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
      </select>

      {/* Modal */}
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
              Changing language will refresh the page. Continue?
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
                Cancel
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
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;
