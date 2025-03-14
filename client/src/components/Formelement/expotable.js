import React, { useEffect, useState } from "react";
import { useEIFormContext } from "../../context/Eicontext";

function ExpoTable() {
  // ✅ Get EI result from context
  const { EIresult } = useEIFormContext();
  const [EIdata, setEIdata] = useState([]);
  const [displaydata, setDisplaydata] = useState(false);

  // ✅ Helper: Convert a numeric value to a qualitative level.
  const interpretLevel = (value) => {
    if (value <= 0.33) return "low";
    else if (value <= 0.66) return "medium";
    else if (value <= 1.00) return "high";
    return "";
  };

  // ✅ Returns a background color for a cell.
  const getCellStyle = (rowLevel, cellType) => {
    if (rowLevel === "low" && cellType === "low") return { background: "rgb(174, 225, 91)" };
    if (rowLevel === "medium" && cellType === "medium") return { background: "yellow" };
    if (rowLevel === "high" && cellType === "high") return { background: "red" };
    return {};
  };

  // ✅ Effect: Update EIdata when EIresult changes
  useEffect(() => {
    if (EIresult) {
      const data = [
        { title: "Infrastructure Workplace", level: interpretLevel(EIresult.InfrastructureWorkplace) },
        { title: "Infrastructure Facility Workplace", level: interpretLevel(EIresult.InfrastructureFacilityWorkplace) },
        { title: "Infrastructure Residence", level: interpretLevel(EIresult.InfrastructureResidence) },
        { title: "Infrastructure Facility Residence", level: interpretLevel(EIresult.InfrastructureFacilityResidence) },
        { title: "Transit", level: interpretLevel(EIresult.Transit) },

        { title: "LifeStyle", level: "just" },
        { title: "Alcohol", level: interpretLevel(EIresult.Alcohol) },
        { title: "Tobacco", level: interpretLevel(EIresult.Tobacco) },
        { title: "Caffeine", level: interpretLevel(EIresult.Caffeine) },
        { title: "Sleep", level: interpretLevel(EIresult.Sleep) },
        { title: "Fluid", level: interpretLevel(EIresult.Fluid) },
        { title: "Air Quality Index (AQI)", level: interpretLevel(EIresult.AQI) },
        { title: "Health Accessibility", level: interpretLevel(EIresult.HealthAccessibility) },
      ].filter((row) => row.level !== ""); // Remove empty values

      setEIdata(data);
      setDisplaydata(data.length > 0);
    } else {
      setDisplaydata(false);
    }
  }, [EIresult]);

  return (
    <div className="index-box">
      <h3>Exposure Index (E.I.)</h3>

      {displaydata ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Exposure</th>
                <th className="exposure">L</th>
                <th className="exposure">M</th>
                <th className="exposure">H</th>
              </tr>
            </thead>
            <tbody>
              {EIdata.map((row, index) => (
                <tr key={index}>
                  <td style={
                    {
                      textAlign: ["Alcohol","Tobacco","Caffeine","Sleep" ].some(keyword =>row.title.includes(keyword))? "right": "left"
                    }
                  }>

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
          <p>⚠ ERROR LOADING DATA</p>
          <button onClick={() => window.location.href = "/profile"}>FILL FORM DATA</button>
        </div>
      )}

      <div style={{ display: "flex", padding: "0px 15px", justifyContent: "space-between" }}>
        <div className="underline1">High</div>
        <div className="underline2">Medium</div>
        <div className="underline3">Low</div>
      </div>
    </div>
  );
}

export default ExpoTable;
