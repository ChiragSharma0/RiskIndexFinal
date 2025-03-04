
// Age Category Calculation
//




export function calculateAgeInDetail(dob) {
    const dobDate = new Date(dob);
    const today = new Date(); // Uses the current date

    let years = today.getFullYear() - dobDate.getFullYear();
    let months = today.getMonth() - dobDate.getMonth();
    let days = today.getDate() - dobDate.getDate();

    // Adjust if necessary
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

export function calculateAgeCategory(age) {
    if (age >= 24 && age <= 39) {
        return 0.33;
    } else if ((age >= 5 && age < 24) || (age >= 40 && age < 65)) {
        return 0.66;
    } else {
        return 1.00;
    }
}






















// Convert weight to kg
export function convertWeightToKg(weight, unit) {
    return unit === "lb" ? weight * 0.453592 : weight;
}

// Convert height to meters
export function convertHeightToMeters(height, unit, heightInches = 0) {
    if (unit === "cm") return height / 100;
    if (unit === "ft") return (height * 0.3048) + (heightInches * 0.0254);
    return height; // Already in meters
}

// Calculate BMI
export function calculateBMI(weight, weightUnit, height, heightUnit, heightInches) {
    if (!weight || !height) return null;

    const weightInKg = convertWeightToKg(weight, weightUnit);
    const heightInMeters = convertHeightToMeters(height, heightUnit, heightInches);

    if (!heightInMeters) return null; // Prevent division by zero

    const bmi = weightInKg / (heightInMeters ** 2);
    return parseFloat(bmi.toFixed(2)); // Round to 1 decimal place
}

// Categorize BMI
export function calculateBMICategory(bmi) {
    if (bmi === null) return null;

    if (bmi >= 18.5 && bmi < 25) return 0.33; // Normal weight
    if ((bmi >= 17.0 && bmi < 18.5) || (bmi >= 25.0 && bmi < 30.0)) return 0.66; // Slightly under/overweight
    return 1.00; // Severely underweight or obese
}












































export function calculateEconomicCategory(income) {
    return income === "low" ? 0.33 : income === "medium" ? 0.66 : 1.00;
}







































export function calculateSocialIsolationCategory(result) {
    return result === "low" ? 0.33 : result === "medium" ? 0.66 : 1.00;
}






























export function calculateEducationCategory(educationLevel, enrolled, age) {
    let result = 0;

    if (educationLevel === "post_graduate" || educationLevel === "graduate" || educationLevel === "Above_post_graduate") {
        result = 0.33;
    } else if (educationLevel === "ssc") {
        result = 0.66;
    } else if (educationLevel === "below_10th") {
        if (age <= 25) {
            result = enrolled === "yes" ? 0.33 : 1.00;
        } else {
            result = 1.00;
        }
    }

    return result;
}





























export function calculateGenderCategory(gender, pregnant) {
    if (gender === "male") {
        return 0.66;
    } else if (gender === "female") {
        return pregnant === "yes" ? 1.00 : 1.00;
    } else if (gender === "intersex") {
        return 1.00;
    }
    return 0;
}
































export function calculateHealthIssuesCategory(chronic, hospital) {
    if (chronic === "yes") {
        return 1.00; // If chronic disease is present, it's high risk
    }
    return hospital === "low" ? 0.33 : hospital === "medium" ? 0.66 : 1.00;
}


export function calculateMedicationCategory(medication) {
    if (!medication) {
        console.error("No medication option selected.");
        return null; // Return null if no option is selected
    }

    if (medication === "no_medication") return 0.33; // No medication → 0.33
    if (medication === "yes_medication") return 1.00; // On medication → 1.00

    console.warn("Unexpected value selected for medication.");
    return 0; // Fallback value for unexpected input
}


export function calculateHealthIssuesIndex(healthIssues, medication) {
    // Calculate health issues and medication categories
    const healthIssuesCategory = calculateHealthIssuesCategory(healthIssues);
    const medicationCategory = calculateMedicationCategory(medication);

    // If medication is 0 (no medication), only health issues factor in
    if (medicationCategory === 0) {
        const result = 1 * healthIssuesCategory;
        console.log("calculateHealthIssuesIndex (No Medication):", result);
        return result;
    }

    // Otherwise, a weighted average is applied
    const result = 0.53 * healthIssuesCategory + 0.47 * medicationCategory;
    console.log("calculateHealthIssuesIndex (With Medication):", result);
    return result;
}






















export function calculateDisabilityCategory(disability, benchmarkDisability) {
    if (disability === "no") return 0.33;
    if (disability === "yes") {
        if (benchmarkDisability === "less_than_benchmark") return 0.66;
        return 1.00;
    }
    return 0o0; // Default if "more_than_benchmark"
}






























































export function calculateVulnerabilityIndex(VIresults) {
    if (!VIresults) return 0; // Prevent errors if data is missing

    const xage = VIresults.ageCategory || 0;
    const xbmi = VIresults.bmiCategory || 0;
    const xes = VIresults.economiccategory || 0;
    const xsi = VIresults.socialIsolationcategory || 0;
    const xed = VIresults.educationStatuscategory || 0;
    const xg = VIresults.genderStatuscategory || 0;
    const xhi = VIresults.healthCategory || 0;
    const xdi = VIresults.disabilityCategory || 0;

    const vi = (0.160 * xage) +
        (0.117 * xbmi) +
        (0.142 * xes) +
        (0.092 * xsi) +
        (0.094 * xed) +
        (0.097 * xg) +
        (0.198 * xhi) +
        (0.100 * xdi);

    
    return vi;
}




/* 



// Convert weight to kg if necessary




// Social Isolation Category Calculation 






















// Gender Category Calculation
























// Health Issues Category Calculation





// Health Issues & Medication Index Calculation
function calculateHealthIssuesIndex() {
    const healthIssues = calculateHealthIssuesCategory();
    const medication = calculateMedicationCategory();
    if (medication == 0) {
        const result = (1 * healthIssues);
        console.log("calculateHealthIssuesIndex:", result);
        return result;
    } else {
        const result = (0.53 * healthIssues + 0.47 * medication);
        console.log("calculateHealthIssuesIndex:", result);
        return result;
    }

}









//Disability index
function calculateDisabilityCategory() {
    const disability = document.getElementById('disability').value;
    const benchmarkDisability = document.getElementById('benchmarkDisability').value;
    let disabilityCategory;

    if (disability === "no") disabilityCategory = 0.33;
    else if (benchmarkDisability === "less_than_benchmark") disabilityCategory = 0.66;
    else disabilityCategory = 1.00;

    console.log("calculateDisabilityCategory:", disabilityCategory);
    return disabilityCategory;
}
function toggleDisabilityOptions() {
    const disability = document.getElementById('disability').value;
    document.getElementById('benchmarkField').classList.toggle('hidden', disability !== 'yes');
}
function updatedisable(disvalue) {
    const medication = document.getElementById('displaydis');
    medication.textContent = disvalue;

}













// Vulnerability Index Calculation
function calculateVulnerabilityIndex() {
    const xage = calculateAgeCategory();
    const xbmi = calculateBMICategory();
    const xes = calculateEconomicCategory();
    const xsi = calculateSocialIsolationCategory();
    const xed = calculateEducationCategory();
    const xg = calculateGenderCategory();
    const xhi = calculateHealthIssuesIndex();
    const xdi = calculateDisabilityCategory(); // Default for disability

    const vi = (0.160 * xage) +
        (0.117 * xbmi) +
        (0.142 * xes) +
        (0.092 * xsi) +
        (0.094 * xed) +
        (0.097 * xg) +
        (0.198 * xhi) +
        (0.100 * xdi);


    console.log("calculateVulnerabilityIndex:", vi);
    return vi;
}


// Form submit handler
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    let vulnerabilityIndex = calculateVulnerabilityIndex();
    
    // Assuming vulnerabilityIndex is already calculated
    localStorage.setItem('VI', vulnerabilityIndex.toFixed(2));

    alert("Your Vulnerability Index is: " + vulnerabilityIndex.toFixed(2));
});


























function calculateRecommendations() {
    const fluidIntake = parseFloat(document.getElementById('fluidIntake').value);
    const activityStatus = document.getElementById('activityStatus').value;

    if (isNaN(fluidIntake) || !activityStatus) {
        alert("Please fill in all fields.");
        return;
    }

    const bodyWeight = 70; // Assume average weight for calculation (in kg), can be replaced by an input
    const bmr = calculateBMR(bodyWeight, 25, 'male'); // Replace 25 with actual age and gender as needed
    const activityMultiplier = getActivityMultiplier(activityStatus);
    const dailyFluidIntake = calculateFluidIntake(bodyWeight);

    const adjustedBMR = bmr * activityMultiplier;
    const fluidRecommendation = adjustedBMR * 0.05; // 50ml for every 100kcal

    let recommendationMessage;

    if (fluidIntake > fluidRecommendation) {
        recommendationMessage = "Your daily fluid intake is adequate.";
    } else if (fluidIntake < (dailyFluidIntake * 0.98)) {
        recommendationMessage = "Your fluid intake is below the recommended levels.";
    } else if (fluidIntake < (dailyFluidIntake * 0.96)) {
        recommendationMessage = "Your fluid intake is significantly below the recommended levels.";
    } else {
        recommendationMessage = "Your fluid intake is marginally below the recommended levels.";
    }

    document.getElementById('recommendationMessage').textContent = recommendationMessage;
    document.getElementById('result').classList.remove('hidden');
}

function calculateBMR(weight, age, gender) {
    if (gender === 'male') {
        return 66 + (13.7 * weight) + (5 * 175) - (6.8 * age); // Assume height is 175 cm for demo
    } else {
        return 655 + (9.6 * weight) + (1.8 * 175) - (4.7 * age); // Assume height is 175 cm for demo
    }
}

function getActivityMultiplier(activityStatus) {
    switch (activityStatus) {
        case 'sedentary':
            return 1.2;
        case 'lightly_active':
            return 1.375;
        case 'moderately_active':
            return 1.55;
        case 'very_active':
            return 1.725;
        case 'extra_active':
            return 1.9;
        default:
            return 1.0;
    }
}

function calculateFluidIntake(weight) {
    let fluidIntake = 0;
    if (weight <= 10) {
        fluidIntake = 100 * weight; // 100ml/kg for the first 10 kg
    } else if (weight <= 20) {
        fluidIntake = 1000 + (50 * (weight - 10)); // 1000ml for first 10kg + 50ml/kg for the next 10kg
    } else {
        fluidIntake = 1000 + 500 + (20 * (weight - 20)); // 1000ml + 500ml + 20ml/kg for the remaining weight
    }
    return fluidIntake; // Total fluid in ml
}





 */