import React, { useEffect, useState } from "react";
import { useEIFormContext } from "../../context/Eicontext";
import { useLocationContext } from "../../context/locationcontext";
import { useVIFormContext } from "../../context/VIformcontext";

function RIfinalVal() {
  const { EIfinal } = useEIFormContext();
  const { HIfinal } = useLocationContext();
  const { VIfinal } = useVIFormContext();

  const [RIfinal, setRIfinal] = useState("0.00");

  useEffect(() => {
    // 🛠 Ensure values are valid floats, default to 0 if not
    const EI = parseFloat(EIfinal) || 0;
    const HI = parseFloat(HIfinal) || 0;
    const VI = parseFloat(VIfinal) || 0;

    console.log("🔍 Debugging Inputs:");
    console.log("📌 EI (EIfinal):", EI);
    console.log("📌 HI (HIfinal):", HI);
    console.log("📌 VI (VIfinal):", VI);

    // Calculate Risk Index
    const result = EI * HI * VI;
    setRIfinal(result.toFixed(2));

    console.log("✅ Final Computation:");
    console.log(`🟢 ${EI} * ${HI} * ${VI} = ${result.toFixed(2)}`);

  }, [EIfinal, HIfinal, VIfinal]);

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
