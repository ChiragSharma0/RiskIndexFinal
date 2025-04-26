import React, { useEffect, useState } from "react";
import { useVIFormContext } from "../../context/VIformcontext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


function VulTable() {
  const { t } = useTranslation();
  const { viresult } = useVIFormContext();
  const [vulnerabilityData, setVulnerabilityData] = useState([]);


  const navigate = useNavigate();



  const interpretLevel = (value) => {
    if (value <= 0.33) return "low";
    else if (value <= 0.66) return "medium";
    else return "high";
  };

  const getCellStyle = (rowLevel, cellType) => {
    if (rowLevel === "low" && cellType === "low")
      return { background: "rgb(174, 225, 91)" };
    if (rowLevel === "medium" && cellType === "medium")
      return { background: "yellow" };
    if (rowLevel === "high" && cellType === "high")
      return { background: "red" };
    return {};
  };

  useEffect(() => {
    if (viresult && Object.keys(viresult).length > 0) {
      const data = [
        { title: t("age"), level: interpretLevel(viresult.ageCategory) },
        { title: t("bmi"), level: interpretLevel(viresult.bmiCategory) },
        { title: t("economic_status"), level: interpretLevel(viresult.economicCategory) },
        { title: t("social_isolation"), level: interpretLevel(viresult.socialIsolationCategory) },
        { title: t("education"), level: interpretLevel(viresult.educationCategory) },
        { title: t("gender"), level: interpretLevel(viresult.genderCategory) },
        { title: t("health_issues_index"), level: "" },
        { title: t("health_issues"), level: interpretLevel(viresult.healthIssuesCategory) },
        { title: t("medication"), level: interpretLevel(viresult.medication) },
        { title: t("disability"), level: interpretLevel(viresult.disabilityCategory) },
      ];
      setVulnerabilityData(data);
    }
  }, [viresult, t]);

  const alignRightTitles = [t("health_issues"), t("medication")];

  return (
    <div className="index-box" style={{ padding: "20px", borderRadius: "10px", background: "#f0f0f0" }}>
      <h3 style={{ textAlign: "center" }}>{t("vulnerability_index")} (V.I.)</h3>

      {!viresult || Object.keys(viresult).length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            {t("error_loading_data")}
          </p>
          <button
  onClick={() => navigate("/profile")}
  style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }} 
          >
            {t("fill_form_data")}
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>{t("vulnerability")}</th>
                <th>{t("low")[0]}</th>
                <th>{t("medium")[0]}</th>
                <th>{t("high")[0]}</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilityData.map((row, index) => (
                <tr key={index}>
                  <td style={{
                    padding: "10px",
                    textAlign: alignRightTitles.includes(row.title) ? "right" : "left",
                  }}>
                    {row.title}
                  </td>
                  <td style={{ ...getCellStyle(row.level, "low"), padding: "10px" }}></td>
                  <td style={{ ...getCellStyle(row.level, "medium"), padding: "10px" }}></td>
                  <td style={{ ...getCellStyle(row.level, "high"), padding: "10px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            gap: "10px",
            fontSize: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div className="underline1"></div>
              <span>{t("high")} ({t("high")[0]})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div className="underline2"></div>
              <span>{t("medium")} ({t("medium")[0]})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div className="underline3"></div>
              <span>{t("low")} ({t("low")[0]})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VulTable;
