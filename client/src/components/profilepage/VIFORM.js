import React, { useState, useEffect } from "react";
import { useVIFormContext } from "../../context/VIformcontext"; // Import context
import axios from "axios";
import "./form.css";

const VIFORM = () => {


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
  const UPDATE_URL = process.env.REACT_APP_UPDATE_VI; // API to update database

  const { VIformData, setVIFormData } = useVIFormContext(); // Get context values

  // Local state for form data
  const [formData, setFormData] = useState({ ...VIformData });

  useEffect(() => {
    // Sync local state with context data when component mounts
    setFormData({ ...VIformData });
  }, [VIformData]); // Update only if VIformData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };


    if (name === "dob") {
      let age = calculateAgeInDetail(value)
     updatedData.age = age.years;
     console.log(updatedData.age);
    }
    // Reset pregnancy status if gender changes
    if (name === "gender" && value !== "female") {
      updatedData.pregnant = "";
    }

    // Reset height in inches if unit is changed to meters or cm
    if (name === "heightUnit" && value !== "ft") {
      updatedData.heightininch = "";
    }

    if (name === "educationLevel" && value !== "below_10th") {
      updatedData.enrolled = "";
    }

    setFormData(updatedData); // Update local form data
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateDatabase();
      setVIFormData(formData); // Push all form data to context at once

      alert("Form data saved successfully!");
      console.log("Updated VIformData:", formData);
    } catch (error) {
console.log(error);
    }


  };

  const handleCancel = () => {
    setFormData({ ...VIformData }); // Reset local state to last saved VIformData
    alert("Form data reverted to previous state.");
  };


  // Update Database
  const updateDatabase = async () => {
    const userid = localStorage.getItem("userid");

    try {
      await axios.post(UPDATE_URL, { userid, vidata: formData });
      console.log("✅ Data updated in database");
    } catch (error) {
      console.error("❌ Error updating data:", error);
    }
  };



  return (
    <div className="form-container">
      <h2>Vulnerability Parameter Survey</h2>
      <form onSubmit={handleSubmit}>




        <fieldset>
          <legend>Age</legend>
          <label>Date of Birth:
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </label>
        </fieldset>





        <fieldset>
          <legend>Body-Mass Index</legend>
          <label>Weight:
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          </label>
          <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>

          <label>Height:
            <input type="number" name="height" value={formData.height} onChange={handleChange} />
          </label>
          {formData.heightUnit === "ft" && (
            <input type="number" name="heightininch" value={formData.heightininch} onChange={handleChange} />
          )}
          <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
            <option value="m">meters</option>
            <option value="cm">centimeters</option>
            <option value="ft">feet & inches</option>
          </select>
        </fieldset>





        <fieldset>
          <legend>Economic Status</legend>
          <label>Annual Household Income:
            <select name="income" value={formData.income} onChange={handleChange}>
              <option value="">Select</option>
              <option value="low">Above ₹18,00,001</option>
              <option value="medium">₹12,00,001 - ₹18,00,000</option>
              <option value="high">Below ₹12,00,000</option>
            </select>
          </label>
        </fieldset>




        <fieldset>
          <legend>Social Isolation</legend>
          <label>During the time of emergency, how many adults are there to assist
            you:
            <select name="adults" value={formData.adults} onChange={handleChange}>
              <option value="">Select</option>
              <option value="low">More than 1 adult</option>
              <option value="medium">1 adult</option>
              <option value="high">No adults</option>
            </select>
          </label>
        </fieldset>



        <fieldset>
          <legend>Education</legend>
          <div id="educationLevelField">
            <label htmlFor="educationLevel">Choose your highest education level:</label>

            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
              <option value="" disabled>Select your education level</option>
              <option value="Above_post_graduate">Above Post Graduate</option>
              <option value="post_graduate">Post Graduate</option>
              <option value="graduate">Graduate</option>
              <option value="ssc">12th/SSC</option>
              <option value="below_10th">10th or below</option>
            </select>



          </div>

          {(formData.educationLevel === "below_10th") && (formData.age < 25) &&
            <label htmlFor="enrolled">Are you currently enrolled in school?
              <select id="enrolled" name="enrolled" onChange={handleChange}>
                <option value="" disabled >Select your answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          }
        </fieldset>


        <fieldset>
          <legend>Gender</legend>
          <label>Specify your Gender:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Other">Others</option>
            </select>
          </label>
          {formData.gender === "female" && (
            <label>Are You pregnant? :
              <select name="pregnant" value={formData.pregnant} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
          )}
        </fieldset>




        <fieldset>
          <legend>Health Issues</legend>
          <label htmlFor="chronic_issues">Do you face any Chronic Disease?
            <select id="chronic_issues" name="chronicIssues" value={formData.chronicIssues} required onChange={handleChange}>
              <option value="" disabled >Select chronic disease status</option>
              <option value="yes">YES</option>
              <option value="no">No</option>
            </select>
          </label>

          {(formData.chronicIssues === "no") &&
            <label>Have you face any acute disease that lead to hospitalization in the following time
              brackets?
              <select id="hospitalization" name="hospitalization" value={formData.hospitalization} onChange={handleChange}>
                <option value="" disabled >Select chronic disease status</option>
                <option value="low">No Hospitalization in more than 2 years</option>
                <option value="medium">Hospitalization within 1-2 years</option>
                <option value="high">Hospitalisation in the last 1 year</option>
              </select>
            </label>
          }

        </fieldset>




        <fieldset>
          <legend>Medication</legend>
          <label>Do You Consume Medication affecting Thermoregulation:
            <select name="medication" value={formData.medication} onChange={handleChange}>
              <option value="">Select</option>
              <option value="no_medication">No</option>
              <option value="yes_medication">Yes</option>
              <option value="not_sure">Don't Know</option>
            </select>
          </label>
        </fieldset>




        <fieldset>
          <legend>Disability</legend>
          <label>Are you disabled?
            <select name="disability" value={formData.disability} onChange={handleChange}>
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>

          {formData.disability === "yes" && (
            <label>Your disability as per the Right of Persons with Disabilities Act, 2016?
              <select name="benchmarkDisability" value={formData.benchmarkDisability} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Above">Above Standard</option>
                <option value="Below">Below Standard</option>
              </select>
            </label>
          )}
        </fieldset>

        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default VIFORM;






















