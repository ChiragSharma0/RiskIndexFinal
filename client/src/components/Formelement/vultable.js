import React, { useEffect, useState } from "react";
import { useVIFormContext } from "../../context/VIformcontext";

function VulTable() {
  const { viresult } = useVIFormContext();
  const [vulnerabilityData, setVulnerabilityData] = useState([]);

  // Helper: Convert a numeric value to a qualitative level.
  const interpretLevel = (value) => {
    if (value <= 0.33) return "low";
    else if (value <= 0.66) return "medium";
    else return "high";
  };

  // Returns a background color for a cell if it matches the cell type.
  const getCellStyle = (rowLevel, cellType) => {
    if (rowLevel === "low" && cellType === "low")
      return { background: "rgb(174, 225, 91)" }; // Green
    if (rowLevel === "medium" && cellType === "medium")
      return { background: "yellow" }; // Yellow
    if (rowLevel === "high" && cellType === "high")
      return { background: "red" }; // Red
    return {};
  };

  // Whenever viresult changes, build an array of rows with interpreted levels.
  useEffect(() => {
    if (viresult) {
      const data = [
        { title: "Age", level: interpretLevel(viresult.ageCategory) },
        { title: "Body-Mass Index", level: interpretLevel(viresult.bmiCategory) },
        { title: "Economic Status", level: interpretLevel(viresult.economicCategory) },
        { title: "Social Isolation", level: interpretLevel(viresult.socialIsolationCategory) },
        { title: "Education", level: interpretLevel(viresult.educationCategory) },
        { title: "Gender (Sex)", level: interpretLevel(viresult.genderCategory) },
        { title: "Health Issues Index", level: ""},

        { title: "Health Issues", level: interpretLevel(viresult.healthIssuesCategory) },
        { title: "Medication", level: interpretLevel(viresult.medication) },
        { title: "Disability", level: interpretLevel(viresult.disabilityCategory) },
      ];
      setVulnerabilityData(data);
    }
  }, [viresult]);

  return (
    <div className="index-box" style={{ cursor: "pointer" }}>
      <h3>Vulnerability Index (V.I.)</h3>
      <table>
        <thead> 
          <tr>
            <th>Vulnerability</th>
            <th>L</th>
            <th>M</th>
            <th>H</th>
          </tr>
        </thead>
        <tbody>
          {vulnerabilityData.map((row, index) => (
            <tr key={index}>
            <td
        style={{
          textAlign: row.title === "Health Issues" || row.title === "Medication" ? "right" : "left",
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
      <div
        style={{
          display: "flex",
          padding: "0px 15px",
          justifyContent: "space-between",
        }}
      >
        <div className="underline1">High</div>
        <div className="underline2">Medium</div>
        <div className="underline3">Low</div>
      </div>
    </div>
  );
}

export default VulTable;
