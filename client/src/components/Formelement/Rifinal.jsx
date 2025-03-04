import React, { useEffect, useState } from "react";
import { useEIFormContext } from "../../context/Eicontext";
import { useLocationContext } from "../../context/locationcontext";
import { useVIFormContext } from "../../context/VIformcontext";

function RIfinalVal() {
  // Get values from contexts
  const { EIfinal } = useEIFormContext();
  const { HIfinal } = useLocationContext();
  const { VIfinal } = useVIFormContext();

  // State to store the final result
  const [RIfinal, setRIfinal] = useState("0.00");

  // Calculate the product whenever any value updates
  useEffect(() => {
    const EI = typeof EIfinal === "number" ? EIfinal : 0;
    const HI = typeof HIfinal === "number" ? HIfinal : 0;
    const VI = typeof VIfinal === "number" ? VIfinal : 0;

    const result = EI * HI * VI;
    setRIfinal(result.toFixed(2));

    console.log("🔹 RIfinal Calculated:", result);
  }, [EIfinal, HIfinal, VIfinal]);

  // Determine the highlight class
  const interpretLevel = (value) => {
    if (value <= 0.33) return "highlight2";
    if (value <= 0.66) return "highlight1";
    if (value <= 1.0) return "highlight";
    return "";
  };

  return (
    <>
      <span className={interpretLevel(Number(RIfinal))}>
        {RIfinal}
      </span>
    </>
  );
}

export default RIfinalVal;
