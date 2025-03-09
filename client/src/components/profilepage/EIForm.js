import React, { useState, useEffect } from "react";
import { useEIFormContext } from "../../context/Eicontext"; // Import context
import axios from "axios";





const EIForm = () => {
  // State to hold form data

  const UPDATE_URL = process.env.REACT_APP_UPDATE_EI ;
  const { EIformData, setEIFormData, sleepOptions } = useEIFormContext(); // Get context values


  const [formData, setFormData] = useState({ ...EIformData });


  useEffect(() => {
    // Sync local state with context data when component mounts
    setFormData({ ...EIformData });
  }, [EIformData]); // Update only if EIformData changes


  const updateDatabase = async () => {
    const userid = localStorage.getItem("userid");
    if (!userid) return;
    try {
      await axios.post(UPDATE_URL, { userid, eidata: formData });
      console.log("✅ Data updated in database");
    } catch (error) {
      console.error("❌ Error updating data:", error);
    }
  };



  // Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  // Handle submit: Save to localStorage and update prevData
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateDatabase();
      setEIFormData(formData);
    }
    catch (error) {
      console.log("error accured while submitting");
    }
    alert("Form submitted successfully!");
  };

  // Handle cancel: Reset to previous data
  const handleCancel = () => {

  };

  return (
    <div className="form-container">

      <form onSubmit={handleSubmit}>
        {/* Infrastructure (Occupation/Workplace) */}
        <fieldset>
          <legend>Infrastructure (Occupation/Place of Work)</legend>

          <label>Location of Your Workplace:</label>
          <select name="workplace" value={formData.workplace} onChange={handleChange}>
            <option value="" disabled>Select workplace location</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>

          {formData.workplace === "indoor" && (
            <>
              <label>Does your workplace have heavy heat-producing machinery?</label>
              <select name="heavy_machinery" value={formData.heavy_machinery} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {formData.heavy_machinery === "yes" && (
                <>
                  <label>Is your workplace:</label>
                  <select name="indoor_structure" value={formData.indoor_structure} onChange={handleChange}>
                    <option value="" disabled>Select structure</option>
                    <option value="indoor_well">Well-constructed</option>
                    <option value="indoor_temp">Temporary/Kutcha</option>
                  </select>
                </>
              )}
            </>
          )}

          <label>Are there services available in your workplace?</label>
          <select name="services" value={formData.services} onChange={handleChange}>
            <option value="" disabled>Select service availability</option>
            <option value="no_service">No Services</option>
            <option value="basic_service">Basic Services (Water, Electricity, Shade)</option>
            <option value="extra_facility">Extra Facilities (AC)</option>
          </select>
        </fieldset>

        {/* Infrastructure (Household) */}
        <fieldset>
          <legend>Infrastructure (Household)</legend>

          <label>Location of Your Residence:</label>
          <select name="residence" value={formData.residence} onChange={handleChange}>
            <option value="" disabled>Select residence location</option>
            <option value="home">Home</option>
            <option value="homeless">Homeless</option>
          </select>

          {formData.residence === "home" && (
            <>
              <label>Choose your living category:</label>
              <select name="structure" value={formData.structure} onChange={handleChange}>
                <option value="" disabled>Select living category</option>
                <option value="pukka_large">Pukka House (30 sq.mt.)</option>
                <option value="pukka_small">Kutcha/Dilapidated or Small Pukka House</option>
              </select>
            </>
          )}

          <label>Are there services available in your residence?</label>
          <select name="home_services" value={formData.home_services} onChange={handleChange}>
            <option value="" disabled>Select service availability</option>
            <option value="no_service">No Services</option>
            <option value="basic_service">Basic Services (Water, Electricity)</option>
            <option value="extra_facility">Extra Facilities (AC)</option>
          </select>
        </fieldset>

        {/* Transit */}
        <fieldset>
          <legend>Transit</legend>
          <label>Your mode of transport to workplace:</label>
          <select name="transport_type" value={formData.transport_type} onChange={handleChange}>
            <option value="" disabled>Select transport type</option>
            <option value="motorized_ac">Motorized (AC)</option>
            <option value="motorized_non_ac">Motorized (Non-AC)</option>
            <option value="non_motorized">Non-motorized</option>
          </select>
        </fieldset>

        {/* Lifestyle */}
        <fieldset>
          <legend>Alcohol Consumption</legend>

          {/* Question 1: Have you consumed alcohol in the last 5 years? */}
          <label htmlFor="alcohol">Have you consumed alcohol in the last 5 years?</label>
          <select name="alcohol" id="alcohol" value={formData.alcohol} onChange={handleChange}>
            <option value="" disabled>Select alcohol consumption status</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {/* Conditional Questions */}
          {formData.alcohol === "yes" && (
            <div>
              {/* Question 2: Do you drink more than 24g/day? */}
              <label htmlFor="daily_consumption">Do you usually drink more than 24g in a day?</label>
              <select id="daily_consumption" name="daily_consumption" value={formData.daily_consumption} onChange={handleChange}>
                <option value="" disabled>Select daily drinking status</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              {/* Conditional Question 3: Frequency in the last quarter */}
              {formData.daily_consumption === "no" && (
                <div>
                  <label htmlFor="quarterly_frequency">
                    In the last quarter, have you drunk more than once a month?
                  </label>
                  <select name="quarterly_frequency" id="quarterly_frequency" value={formData.quarterly_frequency} onChange={handleChange}>
                    <option value="" disabled>Select frequency</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Display Risk */}
        </fieldset>

        <fieldset>
          <legend>Tobacco Consumption Assessment</legend>
          <label>Have you ever consumed tobacco?</label>
          <select name="tobaccoConsumed" value={formData.tobaccoConsumed} onChange={handleChange}>
            <option value="" disabled>Select an option</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {formData.tobaccoConsumed === "yes" && (
            <div>
              <label>Which type of tobacco have you consumed?</label>
              <select name="tobaccoType" value={formData.tobaccoType} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                <option value="smoke">Smoked</option>
                <option value="smokeless">Smokeless</option>
                <option value="both">Both</option>
              </select>

              <label>Have you consumed more than 70g (or 100 cigarettes) of tobacco?</label>
              <select name="tobaccoAmount" value={formData.tobaccoAmount} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Have you consumed tobacco in the last 6 months?</label>
              <select name="recentTobacco" value={formData.recentTobacco} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          )}

        </fieldset>

        <fieldset>
          <legend>Caffeine</legend>
          <label>What is your usual caffeine intake in a day?</label>
          <select name="caffeine" value={formData.caffeine} onChange={handleChange}>
            <option value="" disabled>Select caffeine intake</option>
            <option value="low">Less than 145 mg/day</option>
            <option value="medium">145 - 300 mg/day</option>
            <option value="high">More than 300 mg/day</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Sleep</legend>
          <label>What is your usual sleep duration?</label>
          <select name="sleep" value={formData.sleep} onChange={handleChange}>
            <option value="" disabled>Select sleep duration</option>
            <option value="recommended">{sleepOptions?.recommended||"8HRS"}</option>
            <option value="maybeAppropriate">{sleepOptions?.maybeAppropriate||"6-10hrs"}</option>
            <option value="notRecommended">{sleepOptions?.notRecommended||"less than 6 or more than 10 hrs"}</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Fluids and Exercise</legend>
          <label>How many liters of fluid do you consume daily (in L)?</label>
          <input
            type="number"
            name="fluidIntake"
            step="0.1"
            value={formData.fluidIntake}
            onChange={handleChange}
          />
          <label>What is your daily activity level?</label>
          <select name="activityStatus" value={formData.activityStatus} onChange={handleChange}>
            <option value="" disabled>Select...</option>
            <option value="sedentary">Sedentary</option>
            <option value="lightly_active">Lightly active</option>
            <option value="moderately_active">Moderately active</option>
            <option value="very_active">Very active</option>
            <option value="extra_active">Extra active</option>
          </select>
        </fieldset>
        

        {/* Hospital Accessibility */}
        <fieldset>
          <legend>Health Infrastructure</legend>
          <label>How long does it take to reach a hospital?</label>
          <select name="hospital_access" value={formData.hospital_access} onChange={handleChange}>
            <option value="" disabled>Select hospital access time</option>
            <option value="less_than_30">Less than 30 minutes</option>
            <option value="30-60">30-60 minutes</option>
            <option value="more_than_60">More than 60 minutes</option>
          </select>
        </fieldset>

        {/* Buttons */}
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EIForm;
