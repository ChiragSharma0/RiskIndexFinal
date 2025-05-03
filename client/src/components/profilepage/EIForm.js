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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDatabase();
      setEIFormData(formData);
      alert(t("form.submitAlert"));
    } catch (error) {
      console.error("Error while submitting:", error);
    }
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

              {formData.heavy_machinery === "no" && (
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
                <option value="pukka_small">{t("eiform.form.home.pukka_small")}</option>

                <option value="kaccha_small">{t("eiform.form.home.kaccha_small")}</option>
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

          {/* Question 1: Have you consumed alcohol in the last 5 years? */}
          <label>{t("eiform.form.alcohol.consumed")}</label>
          <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no">{t("eiform.no")}</option>
            <option value="yes">{t("eiform.yes")}</option>
          </select>

          {formData.alcohol === "yes" && (
            <>
              {/* Question 2: Do you drink more than 24g/day? */}
              <label>{t("eiform.form.alcohol.daily")}</label>
              <div id="knowcontent">i
                <div id="table-container">
                  <h2>Alcohol Content by Type</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Type of Alcohol</th>
                        <th>Ethyl Alcohol Content at 20°C (per cent by volume)</th>
                        <th>Max Value</th>
                        <th>Gram of Alcohol/ml</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Brandy or Grape Brandy</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Blended Brandy</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Country Liquor or Plain Country Liquor</td>
                        <td>19 to 43</td>
                        <td>43</td>
                        <td>0.3393861</td>
                      </tr>
                      <tr>
                        <td>Blended Country Liquors</td>
                        <td>19 to 43</td>
                        <td>43</td>
                        <td>0.3393861</td>
                      </tr>
                      <tr>
                        <td>Fenny - Cashew</td>
                        <td>19 to 43</td>
                        <td>43</td>
                        <td>0.3393861</td>
                      </tr>
                      <tr>
                        <td>Fenny - Coconut</td>
                        <td>19 to 43</td>
                        <td>43</td>
                        <td>0.3393861</td>
                      </tr>
                      <tr>
                        <td>Gin</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Liqueur or Cordial or Apertif</td>
                        <td>15 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Rum</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>White Rum</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Vodka</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Whisky</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Malt or Grain Whisky or Single Malt</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Blended Whisky</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Pot Distilled Spirits</td>
                        <td>36 to 50</td>
                        <td>50</td>
                        <td>0.394635</td>
                      </tr>
                      <tr>
                        <td>Table Wine - White</td>
                        <td>7.0 to 15.5</td>
                        <td>15.5</td>
                        <td>0.12233685</td>
                      </tr>
                      <tr>
                        <td>Table Wine - Red</td>
                        <td>7.0 to 15.5</td>
                        <td>15.5</td>
                        <td>0.12233685</td>
                      </tr>
                      <tr>
                        <td>Wine with Carbon Dioxide</td>
                        <td>7.0 to 15.5</td>
                        <td>15.5</td>
                        <td>0.12233685</td>
                      </tr>
                      <tr>
                        <td>Fortified Wine</td>
                        <td>15.0 to 24.0</td>
                        <td>24</td>
                        <td>0.1894248</td>
                      </tr>
                      <tr>
                        <td>Fruit Wine (other than Grape Wine)</td>
                        <td>7.0 to 15.5</td>
                        <td>15.5</td>
                        <td>0.12233685</td>
                      </tr>
                      <tr>
                        <td>Cider</td>
                        <td>0.5 to 9.0</td>
                        <td>9</td>
                        <td>0.0710343</td>
                      </tr>
                      <tr>
                        <td>Perry</td>
                        <td>0.5 to 9.0</td>
                        <td>9</td>
                        <td>0.0710343</td>
                      </tr>
                      <tr>
                        <td>Wine from Other Agricultural and Plant Sources</td>
                        <td>1.5 to 8.0</td>
                        <td>8</td>
                        <td>0.0631416</td>
                      </tr>
                      <tr>
                        <td>Beer - Regular</td>
                        <td>0.5 up to 5.0</td>
                        <td>5</td>
                        <td>0.0394635</td>
                      </tr>
                      <tr>
                        <td>Beer - Strong</td>
                        <td>5.0 up to 8.0</td>
                        <td>8</td>
                        <td>0.0631416</td>
                      </tr>
                      <tr>
                        <td>Draught Beer - Regular</td>
                        <td>0.5 up to 5.0</td>
                        <td>5</td>
                        <td>0.0394635</td>
                      </tr>
                      <tr>
                        <td>Draught Beer - Strong</td>
                        <td>5.0 up to 8.0</td>
                        <td>8</td>
                        <td>0.0631416</td>
                      </tr>
                      <tr>
                        <td>Craft Beer - Regular</td>
                        <td>Up to 5.0</td>
                        <td>5</td>
                        <td>0.0394635</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <select name="daily_consumption" value={formData.daily_consumption} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.no")}</option>
                <option value="yes">{t("eiform.yes")}</option>
              </select>

              {/* Question 3: Frequency in the last quarter */}
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

          {/* Q1 */}
          <label>{t("eiform.form.tobacco.ever")}</label>
          <select name="tobaccoConsumed" value={formData.tobaccoConsumed} onChange={handleChange}>
            <option value="" disabled>{t("eiform.form.select")}</option>
            <option value="no">{t("eiform.form.no")}</option>
            <option value="yes">{t("eiform.form.yes")}</option>
          </select>

          {formData.tobaccoConsumed === "yes" && (
            <>
              {/* Q2 */}
              <label>{t("eiform.form.tobacco.type")}</label>
              <select name="tobaccoType" value={formData.tobaccoType} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="smoke">{t("eiform.form.tobacco.smoke")}</option>
                <option value="smokeless">{t("eiform.form.tobacco.smokeless")}</option>
                <option value="both">{t("eiform.form.tobacco.both")}</option>
              </select>

              {/* Q3 */}
              <label>{t("eiform.form.tobacco.amount")}</label>
              <select name="tobaccoAmount" value={formData.tobaccoAmount} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.form.no")}</option>
                <option value="yes">{t("eiform.form.yes")}</option>
              </select>

              {/* Q4 */}
              <label>{t("eiform.form.tobacco.recent")}</label>
              <select name="recentTobacco" value={formData.recentTobacco} onChange={handleChange}>
                <option value="" disabled>{t("eiform.form.select")}</option>
                <option value="no">{t("eiform.form.no")}</option>
                <option value="yes">{t("eiform.form.yes")}</option>
              </select>

              {/* Q4a */}
              {(formData.tobaccoType === "smokeless" || formData.tobaccoType === "both") && (
                <>
                  <label>{t("eiform.form.tobacco.smokelessRecent")}</label>
                  <select name="smokelessTobacco" value={formData.smokelessTobacco} onChange={handleChange}>
                    <option value="" disabled>{t("eiform.form.select")}</option>
                    <option value="no">{t("eiform.form.no")}</option>
                    <option value="yes">{t("eiform.form.yes")}</option>
                  </select>
                </>
              )}

              {/* Q4b */}
              {(formData.tobaccoType === "smoke" || formData.tobaccoType === "both") && (
                <>
                  <label>{t("eiform.form.tobacco.smokedRecent")}</label>
                  <select name="smokedTobacco" value={formData.smokedTobacco} onChange={handleChange}>
                    <option value="" disabled>{t("eiform.form.select")}</option>
                    <option value="no">{t("eiform.form.no")}</option>
                    <option value="yes">{t("eiform.form.yes")}</option>
                  </select>
                </>
              )}
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
            <option value="maybeAppropriate">{sleepOptions?.mayBeAppropriate || t("form.sleep.default.maybe")}</option>
            <option value="notRecommended">{sleepOptions?.notRecommended || t("form.sleep.default.notRecommended")}</option>
          </select>
        </fieldset>

        {/* Fluids & Exercise */}
        <fieldset>
          <legend>{t("eiform.form.fluids.legend")}</legend>
          <label>{t("eiform.form.fluids.intake")}</label>
          <input type="number" name="fluidIntake" step="0.1" value={formData.fluidIntake} onChange={handleChange} />
          <div>
            <label>{t("eiform.form.fluids.activity")}</label>
            <select name="activityStatus" value={formData.activityStatus} onChange={handleChange}>
              <option value="" disabled>{t("eiform.form.select")}</option>
              <option value="sedentary">{t("eiform.form.fluids.sedentary")}</option>
              <option value="lightly_active">{t("eiform.form.fluids.light")}</option>
              <option value="moderately_active">{t("eiform.form.fluids.moderate")}</option>
              <option value="very_active">{t("eiform.form.fluids.very")}</option>
              <option value="extra_active">{t("eiform.form.fluids.extra")}</option>
            </select>
          </div>
        </fieldset>

        {/* Hospital Access */}
        <fieldset>
          <legend>{t("eiform.form.hospital.legend")}</legend>
          <div>
            <label>
              {t("eiform.form.hospital.access")} from Office
              <select
                name="hospital_access_office"
                value={formData.hospital_access_office}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t("eiform.form.select")}
                </option>
                <option value="less_than_30">{t("eiform.form.hospital.less30")}</option>
                <option value="30-60">{t("eiform.form.hospital.30to60")}</option>
                <option value="more_than_60">{t("eiform.form.hospital.more60")}</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              {t("eiform.form.hospital.access")} from Home
              <select
                name="hospital_access_home"
                value={formData.hospital_access_home}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t("eiform.form.select")}
                </option>
                <option value="less_than_30">{t("eiform.form.hospital.less30")}</option>
                <option value="30-60">{t("eiform.form.hospital.30to60")}</option>
                <option value="more_than_60">{t("eiform.form.hospital.more60")}</option>
              </select>
            </label>
          </div>
        </fieldset>


        {/* Buttons */}
        <button type="submit">{t("eiform.form.submit")}</button>
      </form>
    </div>
  );
};

export default EIForm;
