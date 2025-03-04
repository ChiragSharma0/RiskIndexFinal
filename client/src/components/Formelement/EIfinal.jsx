import React, { useEffect } from "react";
import { useEIFormContext } from "../../context/Eicontext";

function EIfinalVal() {
  // Get `EIfinal` from context
  const {EIfinal} = useEIFormContext(); // ✅ Corrected function call

  // Helper: Convert numeric value to a qualitative level
  const interpretLevel = (value) => {
    if (value <= 0.33) return "highlight2";
    if (value <= 0.66) return "highlight1";
    if (value <= 1.0) return "highlight";
    return "";
  };

  

  // Log whenever `EIfinal` updates
  useEffect(() => {
    console.log("EI rendered", EIfinal);
  }, [EIfinal]);

  return (
    <>
      <span className={interpretLevel(Number(EIfinal))}>
        {EIfinal !== null && EIfinal !== undefined ? Number(EIfinal).toFixed(2) : "0.00"}
      </span>
    </>
  );
}

export default EIfinalVal;
