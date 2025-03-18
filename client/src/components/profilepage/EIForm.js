import React, { useState, useEffect } from "react";
import { useEIFormContext } from "../../context/Eicontext";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UPDATE_URL = process.env.REACT_APP_UPDATE_EI;

const EIForm = () => {
  const { t } = useTranslation();
  const { EIformData, setEIFormData, sleepOptions } = useEIFormContext();
  const [formData, setFormData] = useState({ ...EIformData });

  useEffect(() => {
    setFormData({ ...EIformData });
  }, [EIformData]);

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateDatabase();
      setEIFormData(formData);
    } catch (error) {
      console.log("Error while submitting");
    }
    alert(t("form.submitAlert"));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Infrastructure (Workplace) */}
        <fieldset>
          <legend>{t("eiform.form.work.legend")}</legend>
          <label>{t("eiform.form.work.location")}</label>
          <select name="workplace" value={formData.workplace} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="indoor">{t("eiform.form.work.indoor")}</option>
            <option value="outdoor">{t("eiform.form.work.outdoor")}</option>
          </select>

          {formData.workplace === "indoor" && (
            <>
              <label>{t("eiform.form.work.heatMachinery")}</label>
              <select name="heavy_machinery" value={formData.heavy_machinery} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="yes">{t("eiform.yes")}</option>
                <option value="no">{t("eiform.no")}</option>
              </select>

              {formData.heavy_machinery === "yes" && (
                <>
                  <label>{t("eiform.form.work.structureLabel")}</label>
                  <select name="indoor_structure" value={formData.indoor_structure} onChange={handleChange}>
                    <option value="" disabled>{t("eiform.form.select")}</option>
                    <option value="indoor_well">{t("eiform.form.work.structure.well")}</option>
                    <option value="indoor_temp">{t("eiform.form.work.structure.temp")}</option>
                  </select>
                </>
              )}
            </>
          )}

          <label>{t("eiform.form.work.services")}</label>
          <select name="services" value={formData.services} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no_service">{t("eiform.form.service.none")}</option>
            <option value="basic_service">{t("eiform.form.service.basic")}</option>
            <option value="extra_facility">{t("eiform.form.service.extra")}</option>
          </select>
        </fieldset>

        {/* Residence */}
        <fieldset>
          <legend>{t("eiform.form.home.legend")}</legend>
          <label>{t("eiform.form.home.location")}</label>
          <select name="residence" value={formData.residence} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="home">{t("eiform.form.home.home")}</option>
            <option value="homeless">{t("eiform.form.home.homeless")}</option>
          </select>

          {formData.residence === "home" && (
            <>
              <label>{t("eiform.form.home.category")}</label>
              <select name="structure" value={formData.structure} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="pukka_large">{t("eiform.form.home.pukka")}</option>
                <option value="pukka_small">{t("eiform.form.home.kutcha")}</option>
              </select>
            </>
          )}

          <label>{t("eiform.form.home.services")}</label>
          <select name="home_services" value={formData.home_services} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no_service">{t("eiform.form.service.none")}</option>
            <option value="basic_service">{t("eiform.form.service.basic")}</option>
            <option value="extra_facility">{t("eiform.form.service.extra")}</option>
          </select>
        </fieldset>

        {/* Transit */}
        <fieldset>
          <legend>{t("eiform.form.transit.legend")}</legend>
          <label>{t("eiform.form.transit.transportType")}</label>
          <select name="transport_type" value={formData.transport_type} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="motorized_ac">{t("eiform.form.transit.motorAC")}</option>
            <option value="motorized_non_ac">{t("eiform.form.transit.motorNonAC")}</option>
            <option value="non_motorized">{t("eiform.form.transit.nonMotor")}</option>
          </select>
        </fieldset>

        {/* Lifestyle - Alcohol */}
        <fieldset>
          <legend>{t("eiform.form.alcohol.legend")}</legend>
          <label>{t("eiform.form.alcohol.consumed")}</label>
          <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no">{t("eiform.no")}</option>
            <option value="yes">{t("eiform.yes")}</option>
          </select>

          {formData.alcohol === "yes" && (
            <>
              <label>{t("eiform.form.alcohol.daily")}</label>
              <select name="daily_consumption" value={formData.daily_consumption} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.no")}</option>
                <option value="yes">{t("eiform.yes")}</option>
              </select>

              {formData.daily_consumption === "no" && (
                <>
                  <label>{t("eiform.form.alcohol.frequency")}</label>
                  <select name="quarterly_frequency" value={formData.quarterly_frequency} onChange={handleChange}>
                    <option value="" disabled>{t("eiform.form.select")}</option>
                    <option value="no">{t("eiform.no")}</option>
                    <option value="yes">{t("eiform.yes")}</option>
                  </select>
                </>
              )}
            </>
          )}
        </fieldset>

        {/* Lifestyle - Tobacco */}
        <fieldset>
          <legend>{t("eiform.form.tobacco.legend")}</legend>
          <label>{t("eiform.form.tobacco.ever")}</label>
          <select name="tobaccoConsumed" value={formData.tobaccoConsumed} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no">{t("eiform.no")}</option>
            <option value="yes">{t("eiform.yes")}</option>
          </select>

          {formData.tobaccoConsumed === "yes" && (
            <>
              <label>{t("eiform.form.tobacco.type")}</label>
              <select name="tobaccoType" value={formData.tobaccoType} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="smoke">{t("eiform.form.tobacco.smoke")}</option>
                <option value="smokeless">{t("eiform.form.tobacco.smokeless")}</option>
                <option value="both">{t("eiform.form.tobacco.both")}</option>
              </select>

              <label>{t("eiform.form.tobacco.amount")}</label>
              <select name="tobaccoAmount" value={formData.tobaccoAmount} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.no")}</option>
                <option value="yes">{t("eiform.yes")}</option>
              </select>

              <label>{t("eiform.form.tobacco.recent")}</label>
              <select name="recentTobacco" value={formData.recentTobacco} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.no")}</option>
                <option value="yes">{t("eiform.yes")}</option>
              </select>
            </>
          )}
        </fieldset>

        {/* Caffeine */}
        <fieldset>
          <legend>{t("eiform.form.caffeine.legend")}</legend>
          <label>{t("eiform.form.caffeine.intake")}</label>
          <select name="caffeine" value={formData.caffeine} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="low">{t("eiform.form.caffeine.low")}</option>
            <option value="medium">{t("eiform.form.caffeine.medium")}</option>
            <option value="high">{t("eiform.form.caffeine.high")}</option>
          </select>
        </fieldset>

        {/* Sleep */}
        <fieldset>
          <legend>{t("eiform.form.sleep.legend")}</legend>
          <label>{t("eiform.form.sleep.duration")}</label>
          <select name="sleep" value={formData.sleep} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="recommended">{sleepOptions?.recommended || t("form.sleep.default.recommended")}</option>
            <option value="maybeAppropriate">{sleepOptions?.maybeAppropriate || t("form.sleep.default.maybe")}</option>
            <option value="notRecommended">{sleepOptions?.notRecommended || t("form.sleep.default.notRecommended")}</option>
          </select>
        </fieldset>

        {/* Fluids & Exercise */}
        <fieldset>
          <legend>{t("eiform.form.fluids.legend")}</legend>
          <label>{t("eiform.form.fluids.intake")}</label>
          <input type="number" name="fluidIntake" step="0.1" value={formData.fluidIntake} onChange={handleChange} />
          <label>{t("eiform.form.fluids.activity")}</label>
          <select name="activityStatus" value={formData.activityStatus} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="sedentary">{t("eiform.form.fluids.sedentary")}</option>
            <option value="lightly_active">{t("eiform.form.fluids.light")}</option>
            <option value="moderately_active">{t("eiform.form.fluids.moderate")}</option>
            <option value="very_active">{t("eiform.form.fluids.very")}</option>
            <option value="extra_active">{t("eiform.form.fluids.extra")}</option>
          </select>
        </fieldset>

        {/* Hospital Access */}
        <fieldset>
          <legend>{t("eiform.form.hospital.legend")}</legend>
          <label>{t("eiform.form.hospital.access")}</label>
          <select name="hospital_access" value={formData.hospital_access} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="less_than_30">{t("eiform.form.hospital.less30")}</option>
            <option value="30-60">{t("eiform.form.hospital.30to60")}</option>
            <option value="more_than_60">{t("eiform.form.hospital.more60")}</option>
          </select>
        </fieldset>

        {/* Buttons */}
        <button type="submit">{t("eiform.form.submit")}</button>
      </form>
    </div>
  );
};

export default EIForm;
