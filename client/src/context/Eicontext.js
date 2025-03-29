import React, { createContext, useState, useContext, useEffect } from "react";
import { useVIFormContext } from "./VIformcontext"; // Get VI data
import { useTimeContext } from './timecontext';
import axios from "axios";
import Loader from "../components/common/loader";
import { useLocationContext } from "./locationcontext";
 const Fetchurl = process.env.REACT_APP_FETCH_EI_DATA;

const EIFormContext = createContext();


// Define calculation functions within the same file
function calculateInfrastructureWorkplace(data) {
  if (data.workplace === "indoor") {
    if (data.heavy_machinery === "yes") {
      return 1.0; // Indoor with heavy machinery (High)
    } else if (data.indoor_structure === "indoor_well") {
      return 0.33; // Indoor, well-constructed (Low)
    } else if (data.indoor_structure === "indoor_temp") {
      return 0.66; // Indoor, temporary structure (Medium)
    }
  } else if (data.workplace === "outdoor") {
    return 1.0; // Outdoor (High)
  }
  return 1.0; // Default risk level if no selection
}

function calculateInfrastructureFacilityWorkplace(data) {
  if (data.services === "extra_facility") {
    return 0.33; // Facility: ACs (Low)
  } else if (data.services === "basic_service") {
    return 0.66; // Basic Services (Medium)
  } else if (data.services === "no_service") {
    return 1.0; // No services (High)
  }
  return 1.0; // Default risk level if no selection
}

function calculateinfra(xcond, xfac) {


  return 0.508 * xcond + 0.492 * xfac;
}
function calculateInfrastructureResidence(data) {
  if (data.residence === "home") {
    if (data.structure === "pukka_large") {
      return 0.33; // Pukka House > 30 sq.mt. (Low)
    } else if (data.structure === "pukka_small") {
      return 0.66; // Kutcha/Dilapidated or Small Pukka House (Medium)
    }
  } else if (data.residence === "homeless") {
    return 1.0; // Homeless (High)
  }
  return 1.0; // Default risk level if no selection
}

function calculateInfrastructureFacilityResidence(data) {
  if (data.home_services === "extra_facility") {
    return 0.33; // Facility: AC (Low)
  } else if (data.home_services === "basic_service") {
    return 0.66; // Basic Services (Medium)
  } else if (data.home_services === "no_service") {
    return 1.0; // No services (High)
  }
  return 1.0; // Default risk level if no selection
}



function calculateTransit(data) {
  if (data.transport_type === "motorized_ac") {
    return 0.33; // Air-conditioned spaces (Low)
  } else if (data.transport_type === "motorized_non_ac") {
    return 0.66; // Non-air-conditioned motorized (Medium)
  } else if (data.transport_type === "non_motorized") {
    return 1.0; // Non-motorized (High)
  }
  return 1.0; // Default risk level if no selection
}

function calculateAlcohol(VIdata, data) {
  const userage = parseInt(VIdata?.age, 10) || 0;
  const isPregnant = VIdata?.ispregnent === "true";


  if (data.alcohol === "no") {
    return 0.33; // No alcohol consumption (Low risk)
  } else if (data.alcohol === "yes") {
    if (userage <= 25 || isPregnant) {
      return 1.0; // High risk due to age or pregnancy
    } else if (data.daily_consumption === "yes") {
      return 1.0; // High risk due to daily alcohol consumption
    } else if (data.daily_consumption === "no") {
      return data.quarterly_frequency === "no" ? 0.66 : 1.0; // Medium or High risk
    }
  }
  return 1.0; // Default risk level if input is invalid
}

function calculateTobacco(VIdata, data) {
  const { tobaccoConsumed, tobaccoType, tobaccoAmount, recentTobacco, smokelessTobacco, smokedTobacco } = data;
  const userage = parseInt(VIdata?.age, 10) || 0;
  const isPregnant = VIdata?.ispregnent === "true";


  if (tobaccoConsumed === 'no') {
    return 0.33; // No tobacco consumption (Low risk)
  }
  if (userage < 25 || isPregnant) {
    return 1.00; // High risk for young users or pregnant individuals
  }

  if (tobaccoAmount === 'no') {
    return recentTobacco === 'yes' ? 0.66 : 0.33; // Medium risk if recent, else low
  }

  if (tobaccoAmount === 'yes') {
    if (tobaccoType === 'smoke' || tobaccoType === 'both') {
      return smokedTobacco === 'yes' ? 1.00 : 0.66;
    }
    if (tobaccoType === 'smokeless' || tobaccoType === 'both') {
      return smokelessTobacco === 'yes' ? 1.00 : 0.33;
    }
    if (tobaccoType === 'both') {
      return (smokedTobacco === 'yes' || smokelessTobacco === 'yes') ? 1.00 : 0.33;
    }
  }

  return 0.33; // Default low risk
}

function calculateCaffeine(data) {
  const { caffeine } = data;

  if (caffeine === "low") {
    return 0.33; // Low risk for <145 mg/day
  } else if (caffeine === "medium") {
    return 0.66; // Medium risk for 145-300 mg/day
  } else if (caffeine === "high") {
    return 1.00; // High risk for >300 mg/day
  }

  return 0.33; // Default to low risk
}

function getSleepRecommendationByAge(age) {
  if (age < 1) {
    return { recommended: "14-17 hours", mayBeAppropriate: "11-13 or 18-19 hours", notRecommended: "Less than 11 or more than 19 hours" };

  } else if (age >= 1 && age <= 2) {
    return { recommended: "11-14 hours", mayBeAppropriate: "9-10 or 15-16 hours", notRecommended: "Less than 9 or more than 16 hours" };
  } else if (age >= 3 && age <= 5) {
    return { recommended: "10-13 hours", mayBeAppropriate: "8-9 or 14 hours", notRecommended: "Less than 8 or more than 14 hours" };
  } else if (age >= 6 && age <= 13) {
    return { recommended: "9-11 hours", mayBeAppropriate: "7-8 or 12 hours", notRecommended: "Less than 7 or more than 12 hours" };
  } else if (age >= 14 && age <= 17) {
    return { recommended: "8-10 hours", mayBeAppropriate: "7 or 11 hours", notRecommended: "Less than 7 or more than 11 hours" };
  } else if (age >= 18 && age <= 25) {
    return { recommended: "7-9 hours", mayBeAppropriate: "6 or 10-11 hours", notRecommended: "Less than 6 or more than 11 hours" };
  } else if (age >= 26 && age <= 64) {
    return { recommended: "7-9 hours", mayBeAppropriate: "6 or 10 hours", notRecommended: "Less than 6 or more than 10 hours" };
  } else if (age >= 65) {
    return { recommended: "7-8 hours", mayBeAppropriate: "5-6 or 9 hours", notRecommended: "Less than 5 or more than 9 hours" };
  } else {
    return { recommended: "Invalid", mayBeAppropriate: "Invalid", notRecommended: "Invalid" };
  }
}


function calculateSleep(data) {
  const { sleep } = data;

  if (sleep === "recommended") {
    return 0.33; // Low risk for recommended sleep
  } else if (sleep === "maybeAppropriate") {
    return 0.66; // Medium risk for maybe appropriate sleep
  } else if (sleep === "notRecommended") {
    return 1.00; // High risk for not recommended sleep
  }

  return 0.33; // Default to low risk
}


function calculateFluidCategory(VIformData, EIformData) {
  if (!VIformData.weight || !VIformData.height || !VIformData.age || !VIformData.gender) {
    console.log("❌ Missing critical VIformData values:", VIformData);
    return null;
  }

  if (!EIformData.fluidIntake || isNaN(EIformData.fluidIntake)) {
    console.log("❌ Invalid fluid intake value:", EIformData.fluidIntake);
    return null;
  }

  // Convert weight and height
  const weight = parseFloat(VIformData.weight);
  console.log("HEIGHT VALUES",VIformData.height,VIformData.heightininch,VIformData.heightUnit);

  let heightInMeters;
  if (VIformData.heightUnit === "m") {
    heightInMeters = parseFloat(VIformData.height);
  } else if (VIformData.heightUnit === "cm") {
    heightInMeters = parseFloat(VIformData.height) / 100;
  } else if (VIformData.heightUnit === "ft") {
    const feet = parseFloat(VIformData.height) || 0;
    const inches = parseFloat(VIformData.heightininch) || 0;
    heightInMeters = feet * 0.3048 + inches * 0.0254;
  }

  console.log("🔹 Converted Values:", { weight, heightInMeters });

  if (!weight || !heightInMeters || !VIformData.age || !VIformData.gender || isNaN(EIformData.fluidIntake)) {
    console.log("❌ Missing or invalid input values");
    return null;
  }

  const userFluidIntake = parseFloat(EIformData.fluidIntake) * 1000; // Convert liters to milliliters
  console.log("💧 User Fluid Intake (ml):", userFluidIntake);

  // Calculate fluid needs using different formulas
  const fluidHollidaySegar = calculateFluidIntakeHollidaySegar(weight);
  const fluidBMR = calculateFluidIntakeBMR(weight, heightInMeters, VIformData.age, VIformData.gender, EIformData.activityStatus);
  console.log("📊 Fluid Needs (Holliday-Segar):", fluidHollidaySegar);
  console.log("📊 Fluid Needs (BMR-Based):", fluidBMR);

  // Find the larger of the two fluid requirements
  const largerFluidRequirement = Math.max(fluidHollidaySegar, fluidBMR);
  console.log("✅ Larger Fluid Requirement:", largerFluidRequirement);

  // Thresholds based on body weight
  const lowCategoryThreshold = largerFluidRequirement;
  const twoPercentLess = lowCategoryThreshold * 0.98;
  const fourPercentLess = lowCategoryThreshold * 0.96;

  console.log("📉 Thresholds:", { lowCategoryThreshold, twoPercentLess, fourPercentLess });

  // Determine the category based on user's fluid intake
  if (userFluidIntake >= lowCategoryThreshold) {
    console.log("✅ Fluid Risk: 0.33 (Meets or exceeds requirement)");
    return 0.33;
  } else if (userFluidIntake >= twoPercentLess) {
    console.log("⚠️ Fluid Risk: 0.66 (Slightly below requirement)");
    return 0.66;
  } else {
    console.log("❗ Fluid Risk: 1.00 (High risk)");
    return 1.00;
  }
}


function calculateFluidIntakeHollidaySegar(weight) {
  if (weight <= 10) {
    return 100 * weight;
  } else if (weight <= 20) {
    return 1000 + (50 * (weight - 10));
  } else {
    return 1000 + 500 + (20 * (weight - 20));
  }
}

function calculateFluidIntakeBMR(weight, height, age, gender, activityStatus) {
  let BMR;
  if (gender === 'male') {
    BMR = 66 + (13.7 * weight) + (5 * height * 100) - (6.8 * age);
  } else {
    BMR = 655 + (9.6 * weight) + (1.8 * height * 100) - (4.7 * age);
  }

  const activityMultiplier = getActivityMultiplier(activityStatus);
  return (BMR * activityMultiplier) / 100 * 50;
}

function getActivityMultiplier(activityStatus) {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return multipliers[activityStatus] || 1.0;
}


function calculateAQI(date) {
  const aqiData = {
    10: 171,
    11: 221,
    12: 211,
    13: 193,
    14: 189,
    15: 186
  };

  const aqi = aqiData[date];
  if (aqi === undefined) {
    return null; // No data for this date
  }

  if (aqi <= 150) return 0.33; // Low Risk
  if (aqi <= 200) return 0.66; // Medium Risk
  return 1.00; // High Risk
}

function calculateHealthAccessibility(formData) {
  console.log("🔍 Hospital Access:", formData.hospital_access);

  let riskLevel = 0; // Default to 0 (No Risk)

  if (formData.hospital_access === "less_than_30") {
    riskLevel = 0.33; // Low Risk
  } else if (formData.hospital_access === "30-60") {
    riskLevel = 0.66; // Medium Risk
  } else if (formData.hospital_access === "more_than_60") {
    riskLevel = 1.00; // High Risk
  }

  console.log("✅ Health Accessibility Risk Level:", riskLevel);
  return riskLevel;
}
function calculateExposureIndex(infrastructure, lifestyle, fluidIntake, airQuality, healthAccessibility) {
  return (
    0.282 * infrastructure +
    0.184 * lifestyle +
    0.282 * fluidIntake +
    0.126 * airQuality +
    0.125 * healthAccessibility
  );
}

function calculateLifestyle(alcohol, tobacco, caffeine, sleep) {
  return (
    0.341 * alcohol +
    0.218 * tobacco +
    0.208 * caffeine +
    0.232 * sleep
  );
}


export const EIFormProvider = ({ children }) => {
  const { date } = useTimeContext();
  const { VIformData } = useVIFormContext();
  const { locationSource } = useLocationContext();

  const [EIformData, setEIFormData] = useState({
    workplace: "",
    heavy_machinery: "",
    indoor_structure: "",
    services: "",
    residence: "",
    structure: "",
    home_services: "",
    transport_type: "",
    alcohol: "",
    daily_consumption: null,
    quarterly_frequency: null,
    tobaccoConsumed: "",
    tobaccoType: "",
    tobaccoAmount: null,
    recentTobacco: "",
    smokelessTobacco: "",
    smokedTobacco: "",
    caffeine: "",
    sleep: "",
    fluidIntake: 0o0,
    activityStatus: "",
    air_quality: "",
    hospital_access: "",
  });

  const [EIresult, setEIresult] = useState({});
  const [EIfinal, setEIfinal] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 🔹 Loading state added

  const [sleepOptions, setSleepOptions] = useState({
    recommended: "Recommended",
    mayBeAppropriate: "May be appropriate",
    notRecommended: "Not recommended",
  });

  // Fetch EI Data on Mount
  useEffect(() => {
    if (!VIformData.dob) {
      setIsLoading(false); // Stop loading if no DOB
      return;
    }

    const fetchEIData = async () => {
      const userid = localStorage.getItem("userid");
      if (!userid) {
        console.error("❌ User ID not found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${Fetchurl}`, { userid });
        console.log("🔹 API response received EI:", response.data.EIdata);
        if (response.status === 200 && response.data.EIdata) {
          setEIFormData(response.data.EIdata);
        }
      } catch (error) {
        console.error("❌ Data fetch failed", error);
      } finally {
        setIsLoading(false); // 🔹 Always stop loading, even on error
      }
    };

    fetchEIData();
    setSleepOptions(getSleepRecommendationByAge(VIformData?.age));
    CalculateResult();
  }, [VIformData]);

  // Recalculate Results on Data Change
  useEffect(() => {
    if (!EIformData.alcohol || !VIformData.age) return;
    CalculateResult();
  }, [EIformData, VIformData, locationSource]);

  function CalculateResult() {
    if (!EIformData) return;
  
    const InfrastructureWorkplace = calculateInfrastructureWorkplace(EIformData);
    const InfrastructureFacilityWorkplace = calculateInfrastructureFacilityWorkplace(EIformData);
    const workrisk = calculateinfra(InfrastructureWorkplace, InfrastructureFacilityWorkplace);
  
    const InfrastructureResidence = calculateInfrastructureResidence(EIformData);
    const InfrastructureFacilityResidence = calculateInfrastructureFacilityResidence(EIformData);
    const homerisk = calculateinfra(InfrastructureResidence, InfrastructureFacilityResidence);
    const Transit = calculateTransit(EIformData);
  
    const Alcohol = calculateAlcohol(VIformData, EIformData);
    const Tobacco = calculateTobacco(VIformData, EIformData);
    const Caffeine = calculateCaffeine(EIformData);
    const Sleep = calculateSleep(EIformData);
    const liferisk = calculateLifestyle(Alcohol, Tobacco, Caffeine, Sleep);
    const Fluid = calculateFluidCategory(VIformData, EIformData);
    const AQI = calculateAQI(date.date);
    const HealthAccessibility = calculateHealthAccessibility(EIformData);
  
    const task = locationSource?.toLowerCase();
    let currentrisk;
    let Infrastructure = {};
  
    if (task === "workplace") {
      Infrastructure = {
        InfrastructureWorkplace,
        InfrastructureFacilityWorkplace
      };
      currentrisk = workrisk;
    } else if (task === "residence") {
      Infrastructure = {
        InfrastructureResidence,
        InfrastructureFacilityResidence
      };
      currentrisk = homerisk;
    } else if (task === "traveling") {
      Infrastructure = {
        Transit
      };
      currentrisk = Transit;
    }
  
    // ✅ Check if Infrastructure has at least one meaningful (non-null/undefined/empty) value
    const hasInfrastructureValue = Object.values(Infrastructure).some(
      (val) => val !== null && val !== undefined && val !== "" && !(Array.isArray(val) && val.length === 0)
    );
  
    if (!hasInfrastructureValue) {
      console.warn("⚠️ Infrastructure has no valid values. EI result not set.");
      return;
    }
  
    const components = {
      ...Infrastructure,
      Alcohol,
      Tobacco,
      Caffeine,
      Sleep,
      Fluid,
      AQI,
      HealthAccessibility,
    };
  
    console.log("🛠 Final Components before setting state:", components);
    setEIresult(components);
  }
  

  useEffect(() => {
    console.log("✅ Updated EIresult:", EIresult);

    const InfrastructureWorkplace = calculateInfrastructureWorkplace(EIformData);
    const InfrastructureFacilityWorkplace = calculateInfrastructureFacilityWorkplace(EIformData);
    const workrisk = calculateinfra(InfrastructureWorkplace, InfrastructureFacilityWorkplace);

    const InfrastructureResidence = calculateInfrastructureResidence(EIformData);
    const InfrastructureFacilityResidence = calculateInfrastructureFacilityResidence(EIformData);
    const homerisk = calculateinfra(InfrastructureResidence, InfrastructureFacilityResidence);
    const Transit = calculateTransit(EIformData);

    const Alcohol = calculateAlcohol(VIformData, EIformData);
    const Tobacco = calculateTobacco(VIformData, EIformData);
    const Caffeine = calculateCaffeine(EIformData);
    const Sleep = calculateSleep(EIformData);
    const liferisk = calculateLifestyle(Alcohol, Tobacco, Caffeine, Sleep);
    const Fluid = calculateFluidCategory(VIformData, EIformData);
    const AQI = calculateAQI(date.date);
    const HealthAccessibility = calculateHealthAccessibility(EIformData);

    let currentrisk;

    const task = locationSource?.toLowerCase();
    let Infrastructure = {};

    if (task === "workplace") {
      Infrastructure = { InfrastructureWorkplace, InfrastructureFacilityWorkplace };
      currentrisk = workrisk;
    } else if (task === "residence") {
      Infrastructure = { InfrastructureResidence, InfrastructureFacilityResidence };
      currentrisk = homerisk;
    } else if (task === "transit") {
      Infrastructure = { Transit };
      currentrisk = Transit;
    }
console.log("infrastructure", Infrastructure);
    const finalIndex = calculateExposureIndex(currentrisk, liferisk, Fluid, AQI, HealthAccessibility);
    setEIfinal(finalIndex);
    console.log("Final Exposure Index:", finalIndex);
  }, [EIresult]);

  useEffect(() => {
    console.log("updated EIfinal", EIfinal);
  }, [EIfinal]);

  return (
    <EIFormContext.Provider value={{ EIformData, setEIFormData, EIfinal, EIresult, sleepOptions }}>
      {isLoading ? <Loader /> : children} {/* 🔹 Show Loader while loading */}
    </EIFormContext.Provider>
  );
};

export const useEIFormContext = () => useContext(EIFormContext);









