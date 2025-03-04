import React, { useEffect, useState } from "react";
import { useLocationContext } from "../../context/locationcontext";

function HIfinalVal() {
  // Get `HIfinal` from context
  const {HIfinal} = useLocationContext();

  // State to store formatted display value
  const [displayvalue, setValue] = useState("0.00"); // Default to "0.00"

  // Update `displayvalue` when `HIfinal` changes
  useEffect(() => {
    if (typeof HIfinal === "number") {
      setValue(HIfinal.toFixed(2));
    }
    console.log("HI rendered", HIfinal);
  }, [HIfinal]);

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

export default HIfinalVal;
