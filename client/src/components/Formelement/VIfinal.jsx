import React, { useEffect, useState } from "react";
import { useVIFormContext } from "../../context/VIformcontext";

function VIfinalVal() {
  // Get `VIfinal` from context
  const {VIfinal} = useVIFormContext();

  // State to store formatted display value
  const [displayvalue, setValue] = useState("0.00"); // Default to "0.00"

  // Update `displayvalue` when `VIfinal` changes
  useEffect(() => {
    if (typeof VIfinal === "number" && !isNaN(VIfinal)) {
      setValue(VIfinal.toFixed(2));
    } else {
      setValue("0.00");
    }
  }, [VIfinal]);
  

  const interpretLevel = (value) => {
    if (value <= 0.33) return "highlight2"; 
    if (value <= 0.66) return "highlight1";
    if (value <= 1.0) return "highlight";
    return "";
  };


  

  return (
    <>
      <span className={interpretLevel(Number(displayvalue))}>
        {displayvalue || "0.00"}
      </span>
    </>
  );
}

export default VIfinalVal;
