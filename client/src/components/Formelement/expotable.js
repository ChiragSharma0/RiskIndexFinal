import React, { useEffect, useState } from "react";
import { useEIFormContext } from "../../context/Eicontext";
import { useTranslation } from "react-i18next";

function ExpoTable() {
  const { t } = useTranslation();
  const { EIresult } = useEIFormContext();
  const [EIdata, setEIdata] = useState([]);
  const [displaydata, setDisplaydata] = useState(false);

  const interpretLevel = (value) => {
    if (value <= 0.33) return "low";
    else if (value <= 0.66) return "medium";
    else if (value <= 1.0) return "high";
    return "";
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
      setDisplaydata(data.length > 0);
    } else {
      setDisplaydata(false);
    }
  }, [EIresult, t]);

  return (
    <div className="index-box">
      <h3>{t("exposure_index")} (E.I.)</h3>

      {displaydata ? (
        <>
          <table>
            <thead>
              <tr>
                <th>{t("exposure")}</th>
                <th className="exposure">{t("low")[0]}</th>
                <th className="exposure">{t("medium")[0]}</th>
                <th className="exposure">{t("high")[0]}</th>
              </tr>
            </thead>
            <tbody>
              {EIdata.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      textAlign: [t("alcohol"), t("tobacco"), t("caffeine"), t("sleep")].includes(row.title)
                        ? "right"
                        : "left",
                    }}
                  >
                    {row.title}
                  </td>
                  <td style={getCellStyle(row.level, "low")}></td>
                  <td style={getCellStyle(row.level, "medium")}></td>
                  <td style={getCellStyle(row.level, "high")}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={{ color: "red", textAlign: "center", padding: "10px" }}>
          <hr />
          <p>{t("error_loading_data")}</p>
          <button onClick={() => (window.location.href = "/profile")}>
            {t("fill_form_data")}
          </button>
        </div>
      )}

      <div style={{ display: "flex", padding: "0px 15px", justifyContent: "space-between",gap:"10px" }}>
        <div style={{display:"flex",flex:"1",alignContent:"center",justifyContent:"right",flexWrap:"wrap"}}>
          <div className="underline1"></div>
          <div className="">{t("high")}</div>
        </div>
        <div style={{display:"flex",flex:"1"}}>

          <div className="underline2"></div>
          <div className="">{t("medium")}</div>
        </div>
        <div style={{display:"flex",flex:"1"}}>

          <div className="underline3"></div>
          <div className="">{t("low")}</div>
        </div>
      </div>
    </div>
  );
}

export default ExpoTable;
