import React, { useEffect, useState } from "react";
import { useEIFormContext } from "../../context/Eicontext";
import { useVIFormContext } from "../../context/VIformcontext";
import { useHIContext } from "../../context/hicontext";

function RIfinalVal() {
  const { EIfinal } = useEIFormContext();
  const { HIfinal } = useHIContext();
  const { VIfinal } = useVIFormContext();

  const [RIfinal, setRIfinal] = useState("0o0");
  useEffect(() => {
    const EI = parseFloat(EIfinal) || 0;
    const HI = parseFloat(HIfinal) || 0;
    const VI = parseFloat(VIfinal) || 0;
  
    console.log("🔍 Debugging Inputs:");
    console.log("📌 EI (EIfinal):", EI);
    console.log("📌 HI (HIfinal):", HI);
    console.log("📌 VI (VIfinal):", VI);
  
    const result = EI * HI * VI;
    console.log("🟢 Computed RIfinal:", result.toFixed(2));
  
    // ✅ Prevent unnecessary state updates
    setRIfinal((prev) => {
      if (prev !== result.toFixed(2)) {
        console.log("✅ Updating RIfinal state");
        return result.toFixed(2);
      } else {
        console.log("⚠️ No change in RIfinal, skipping update");
        return prev;
      }
    });
  }, [EIfinal, HIfinal, VIfinal]);
  
  
  const interpretLevel = (value) => {
    if (value <= 0.33) return "rgb(174, 225, 91)";
    if (value <= 0.66) return "yellow";
    if (value <= 1.0) return "red";
    return "";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <div style={{ display: "flex" ,flex:"1",justifyContent:"right"}}>
        <div className="highlight1" style={{border:"none", margin:"0px"}}>
          {RIfinal}
        </div>
        <div  style={{ height: "100%", width: "40%" ,backgroundColor:interpretLevel(Number(RIfinal)) ,border: "2px solid" ,marginLeft:"2%"   }}></div>
      </div>
    </div>
  );
}

export default RIfinalVal;
