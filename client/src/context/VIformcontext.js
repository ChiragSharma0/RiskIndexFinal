import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Loader from "../components/common/loader";

const FETCH_URL = process.env.REACT_APP_FETCH_VI_DATA; // Ensure this is defined in your .env file

const VIFormContext = createContext();

// ----- Helper Functions for Calculations -----


function calculateAgeInDetail(dob) {
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) return null; // Handle invalid date

  const today = new Date(); // Always use current date
  let years = today.getFullYear() - dobDate.getFullYear();
  let months = today.getMonth() - dobDate.getMonth();
  let days = today.getDate() - dobDate.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
    days += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function calculateAgeCategoryFromDOB(dob) {
  const fullAge = calculateAgeInDetail(dob);
  if (!fullAge) return null; // Handle invalid input
  const age = fullAge.years;

  if (age >= 24 && age <= 39) return 0.33;
  if ((age >= 5 && age < 24) || (age >= 40 && age <= 65)) return age === 65 ? 1.0 : 0.66;
  return 1.0;
}

// Example usage


function calculateBMICategoryFromData(data) {
  let weight = parseFloat(data.weight);
  if (data.weightunit === "lb") {
    weight = weight * 0.453592;
  }
  let heightInMeters;
  if (data.heightunit === "m") {
    heightInMeters = parseFloat(data.height);
  } else if (data.heightunit === "cm") {
    heightInMeters = parseFloat(data.height) / 100;
  } else if (data.heightunit === "ft") {
    const feet = parseFloat(data.height) || 0;
    const inches = parseFloat(data.heightininch) || 0;
    heightInMeters = feet * 0.3048 + inches * 0.0254;
  }
  if (!heightInMeters || heightInMeters === 0) return 1.0;
  const bmi = weight / (heightInMeters * heightInMeters);
  if (bmi >= 18.5 && bmi < 25) {
    return 0.33;
  } else if ((bmi >= 17.0 && bmi < 18.5) || (bmi >= 25.0 && bmi < 30.0)) {
    return 0.66;
  } else if (bmi < 17.0 || bmi >= 30.0) {
    return 1.0;
  }
  return 1.0;
}

function calculateEconomicCategoryFromIncome(income) {
  if (income === "low") return 0.33;
  if (income === "medium") return 0.66;
  if (income === "high") return 1.0;
  return 1.0;
}

function calculateSocialIsolationCategoryFromAdults(adults) {
  if (adults === "low") return 0.33;
  if (adults === "medium") return 0.66;
  if (adults === "high") return 1.0;
  return 1.0;
}

function calculateEducationCategoryFromData(educationLevel, enrolled, age) {
  if (educationLevel === "post_graduate" || educationLevel === "graduate" || educationLevel === "Above_post_graduate") {
    return 0.33;
  } else if (educationLevel === "ssc") {
    return 0.66;
  } else if (educationLevel === "below_10th") {
    if (age && age <= 25) {
      return enrolled === "yes" ? 0.33 : 1.0;
    } else {
      return 1.0;
    }
  }
  return 1.0;
}

function calculateGenderCategoryFromData(gender, pregnant) {
  if (gender === "male") return 0.66;
  if (gender === "female") return pregnant === "Yes" ? 1.0 : 0.66;
  if (gender === "Other") return 1.0;
  return 1.0;
}

function calculateHealthIssuesCategoryFromData(chronicIssues, hospitalization) {
  if (chronicIssues === "yes") return 1.0;
  if (chronicIssues === "no") {
    if (hospitalization === "low") return 0.33;
    if (hospitalization === "medium") return 0.66;
    if (hospitalization === "high") return 1.0;
  }
  return 0;
}

function calculateMedicationCategoryFromData(medication) {
  if (medication === "no_medication") return 0.33;
  if (medication === "yes_medication") return 1.0;
  return 0;
}

function calculateHealthIssuesIndexFromData(healthIssuesCategory, medicationCategory) {
  if (medicationCategory === 0) return 1 * healthIssuesCategory;
  return 0.53 * healthIssuesCategory + 0.47 * medicationCategory;
}

function calculateDisabilityCategoryFromData(disability, benchmarkDisability) {
  if (disability === "no") return 0.33;
  if (disability === "yes") {
    return benchmarkDisability === "Above" ? 0.33 : 1.0;
  }
  return 1.0;
}

// Combine individual values to calculate the final vulnerability index
function calculateVulnerabilityIndexFromComponents(components) {
  return (
    0.160 * components.ageCategory +
    0.117 * components.bmiCategory +
    0.142 * components.economicCategory +
    0.092 * components.socialIsolationCategory +
    0.094 * components.educationCategory +
    0.097 * components.genderCategory +
    0.198 * components.healthIssuesIndex +
    0.100 * components.disabilityCategory
  );
}

// ----- End of Helper Functions -----


// Create Context

export const VIFormProvider = ({ children }) => {
  const [VIformData, setVIFormData] = useState({
    dob: "",
    age: "",
    weight: "",
    weightunit: "kg",
    height: "",
    heightUnit: "m",
    heightininch: "",
    income: "",
    adults: "",
    educationLevel: "",
    enrolled: "",
    gender: "",
    pregnant: "",
    chronicIssues: "",
    hospitalization: "",
    medication: "",
    disability: "",
    benchmarkDisability: "",
  });

  const [viresult, setViresult] = useState({});
  const [VIfinal, setVIfinal] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 🔹 Added Loading State

  // Fetch initial VIdata from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      const userid = localStorage.getItem("userid");
      if (!userid) {
        console.error("❌ User ID not found in localStorage");
        setIsLoading(false); // 🔹 Stop loading even if user ID is missing
        return;
      }
      try {
        const response = await axios.post(`${FETCH_URL}`, { userid });
        if (response.status === 200 && response.data.VIdata) {
          console.log("🔹 Data fetched:", response.data.VIdata);
          setVIFormData(response.data.VIdata);
        }
      } catch (error) {
        console.error("❌ Data fetch failed:", error);
      } finally {
        setIsLoading(false); // 🔹 Always stop loading, even on failure
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!VIformData.dob) return;

    const ageCategory = calculateAgeCategoryFromDOB(VIformData.dob);
    const bmiCategory = calculateBMICategoryFromData(VIformData);
    const economicCategory = calculateEconomicCategoryFromIncome(VIformData.income);
    const socialIsolationCategory = calculateSocialIsolationCategoryFromAdults(VIformData.adults);
    const educationCategory = calculateEducationCategoryFromData(VIformData.educationLevel, VIformData.enrolled, VIformData.age);
    const genderCategory = calculateGenderCategoryFromData(VIformData.gender, VIformData.pregnant);
    const healthIssuesCategory = calculateHealthIssuesCategoryFromData(VIformData.chronicIssues, VIformData.hospitalization);
    const medicationCategory = calculateMedicationCategoryFromData(VIformData.medication);
    const healthIssuesIndex = calculateHealthIssuesIndexFromData(healthIssuesCategory, medicationCategory);
    const disabilityCategory = calculateDisabilityCategoryFromData(VIformData.disability, VIformData.benchmarkDisability);

    const components = {
      ageCategory,
      bmiCategory,
      economicCategory,
      socialIsolationCategory,
      educationCategory,
      genderCategory,
      healthIssuesIndex,
      healthIssuesCategory,
      medicationCategory,
      disabilityCategory,
    };

    setViresult(components);
    console.log("Updated viresult:", components);
  }, [VIformData]);

  useEffect(() => {
    if (!viresult) return;
    console.log("Updated VIfinal data");
    const finalIndex = calculateVulnerabilityIndexFromComponents(viresult);
    setVIfinal(finalIndex);
  }, [viresult]);

  return (
    <VIFormContext.Provider value={{ VIformData, setVIFormData, viresult, VIfinal }}>
      {isLoading ? <Loader /> : children} {/* 🔹 Show Loader while loading */}
    </VIFormContext.Provider>
  );
};

export const useVIFormContext = () => useContext(VIFormContext);
