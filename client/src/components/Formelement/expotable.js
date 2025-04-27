import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEIFormContext } from "../../context/Eicontext";
import { useTranslation } from "react-i18next";

function ExpoTable() {
  const { t } = useTranslation();
  const { EIresult } = useEIFormContext();
  const [EIdata, setEIdata] = useState([]);
  const [displaydata, setDisplaydata] = useState(false);

  const navigate = useNavigate();


  const interpretLevel = (value) => {
    if (value <= 0.33) return "low";
    else if (value <= 0.66) return "medium";
    else if (value <= 1.0) return "high";
    return "";
  };

  const getCellStyle = (rowLevel, cellType) => {
    if (rowLevel === "low" && cellType === "low") return { background: "rgb(174, 225, 91)" };
    if (rowLevel === "medium" && cellType === "medium") return { background: "yellow" };
    if (rowLevel === "high" && cellType === "high") return { background: "red" };
    return {};
  };

  useEffect(() => {
    if (EIresult) {
      const data = [
        { title: t("infrastructure_workplace"), level: interpretLevel(EIresult.InfrastructureWorkplace) },
        { title: t("infrastructure_facility_workplace"), level: interpretLevel(EIresult.InfrastructureFacilityWorkplace) },
        { title: t("infrastructure_residence"), level: interpretLevel(EIresult.InfrastructureResidence) },
        { title: t("infrastructure_facility_residence"), level: interpretLevel(EIresult.InfrastructureFacilityResidence) },
        { title: t("transit"), level: interpretLevel(EIresult.Transit) },
        { title: t("lifestyle"), level: "none" },
        { title: t("alcohol"), level: interpretLevel(EIresult.Alcohol) },
        { title: t("tobacco"), level: interpretLevel(EIresult.Tobacco) },
        { title: t("caffeine"), level: interpretLevel(EIresult.Caffeine) },
        { title: t("sleep"), level: interpretLevel(EIresult.Sleep) },
        { title: t("fluid"), level: interpretLevel(EIresult.Fluid) },
        { title: t("aqi"), level: interpretLevel(EIresult.AQI) },
        { title: t("health_accessibility"), level: interpretLevel(EIresult.HealthAccessibility) },
      ].filter((row) => row.level !== "");
      setEIdata(data);
      console.log(data,"logged data");
      setDisplaydata(data.length > 5);
    } else {
      setDisplaydata(false);
    }
  }, [EIresult, t]);

  const alignRightTitles = [t("alcohol"), t("tobacco"), t("caffeine"), t("sleep")];

  return (
    <div className="index-box" style={{ padding: "10px", borderRadius: "10px", background: "#f0f0f0" }}>
      <h3 style={{ textAlign: "center" }}>{t("exposure_index")} (E.I.)</h3>

      {!displaydata ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            {t("error_loading_data") || "No data found. Please fill the form."}
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
            {t("fill_form_data") || "Fill the Form"}
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>{t("exposure")}</th>
                <th>{t("low")[0]}</th>
                <th>{t("medium")[0]}</th>
                <th>{t("high")[0]}</th>
              </tr>
            </thead>
            <tbody>
              {EIdata.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      textAlign: alignRightTitles.includes(row.title) ? "right" : "left",
                    }}
                  >
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

export default ExpoTable;
