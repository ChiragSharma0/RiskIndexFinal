import React, { useEffect, useState } from "react";
import { useVIFormContext } from "../../context/VIformcontext";
import { useTranslation } from "react-i18next";

function VulTable() {
  const { t } = useTranslation();
  const { viresult } = useVIFormContext();
  const [vulnerabilityData, setVulnerabilityData] = useState([]);

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
    if (viresult) {
      const data = [
        { title: t("age"), level: interpretLevel(viresult.ageCategory) },
        { title: t("bmi"), level: interpretLevel(viresult.bmiCategory) },
        { title: t("economic_status"), level: interpretLevel(viresult.economicCategory) },
        { title: t("social_isolation"), level: interpretLevel(viresult.socialIsolationCategory) },
        { title: t("education"), level: interpretLevel(viresult.educationCategory) },
        { title: t("gender"), level: interpretLevel(viresult.genderCategory) },
        { title: t("health_issues_index"), level: "" }, // placeholder row
        { title: t("health_issues"), level: interpretLevel(viresult.healthIssuesCategory) },
        { title: t("medication"), level: interpretLevel(viresult.medication) },
        { title: t("disability"), level: interpretLevel(viresult.disabilityCategory) },
      ];
      setVulnerabilityData(data);
    }
  }, [viresult, t]);

  const alignRightTitles = [t("health_issues"), t("medication")];

  return (
    <div className="index-box" style={{ cursor: "pointer" }}>
      <h3>{t("vulnerability_index")} (V.I.)</h3>
      <table>
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
              <td
                style={{
                  textAlign: alignRightTitles.includes(row.title) ? "right" : "left",
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
      <div style={{ display: "flex", padding: "0px 10px", justifyContent: "space-between",gap:"10px" }}>
        <div style={{display:"flex",alignContent:"center",justifyContent:"right",}}>
          <div className="underline1"></div>
          <div className="">{t("high")}({t("high")[0]})</div>
        </div>
        <div style={{display:"flex"}}>

          <div className="underline2"></div>
          <div className="">{t("medium")}({t("medium")[0]})</div>
        </div>
        <div style={{display:"flex"}}>

          <div className="underline3"></div>
          <div className="">{t("low")}({t("low")[0]})</div>
        </div>
      </div>
    </div>
  );
}

export default VulTable;
