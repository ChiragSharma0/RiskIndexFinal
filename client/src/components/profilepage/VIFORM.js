import React, { useState, useEffect } from "react";
import { useVIFormContext } from "../../context/VIformcontext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./form.css";

const UPDATE_URL = process.env.REACT_APP_UPDATE_VI;

const VIFORM = () => {
  const { t } = useTranslation();

  function calculateAgeInDetail(dob) {
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return null;

    const today = new Date();
    let years = today.getFullYear() - dobDate.getFullYear();
    let months = today.getMonth() - dobDate.getMonth();
    let days = today.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  const { VIformData, setVIFormData } = useVIFormContext();
  const [formData, setFormData] = useState({ ...VIformData });

  useEffect(() => {
    setFormData({ ...VIformData });
  }, [VIformData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "dob") {
      let age = calculateAgeInDetail(value);
      updatedData.age = age.years;
      console.log(updatedData.age);
    }

    if (name === "gender" && value !== "female") {
      updatedData.pregnant = "";
    }

    if (name === "heightUnit" && value !== "ft") {
      updatedData.heightininch = "";
    }

    if (name === "educationLevel" && value !== "below_10th") {
      updatedData.enrolled = "";
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateDatabase();
      setVIFormData(formData);
      alert(t("viform.formSaved"));
      console.log("Updated VIformData:", formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFormData({ ...VIformData });
    alert(t("viform.formReverted"));
  };

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
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>{t("viform.ageLegend")}</legend>
          <label>{t("viform.dob")}
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </label>
        </fieldset>

        <fieldset>
          <legend>{t("viform.bmiLegend")}</legend>
          <label>{t("viform.weight")}
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          </label>
          <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
            <option value="kg">{t("viform.kg")}</option>
            <option value="lb">{t("viform.lb")}</option>
          </select>

           {/* Height Field */}
      <label>
        {formData.heightUnit === "ft"
          ? t("viform.heightFeet")
          : t("viform.height")}
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
      </label>

      {/* Height in Inches - Only if heightUnit is ft */}
      {formData.heightUnit === "ft" && (
        <label>
          {t("viform.heightInInches")}
          <input
            type="number"
            name="heightininch"
            value={formData.heightininch}
            onChange={handleChange}
          />
        </label>
      )}
      
          <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
            <option value="m">{t("viform.meters")}</option>
            <option value="cm">{t("viform.centimeters")}</option>
            <option value="ft">{t("viform.feetInches")}</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>{t("viform.economicLegend")}</legend>
          <label>{t("viform.income")}
            <select name="income" value={formData.income} onChange={handleChange}>
              <option value="">{t("viform.select")}</option>
              <option value="low">{t("viform.incomeHigh")}</option>
              <option value="medium">{t("viform.incomeMid")}</option>
              <option value="high">{t("viform.incomeLow")}</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>{t("viform.isolationLegend")}</legend>
          <label>{t("viform.adultsHelp")}
            <select name="adults" value={formData.adults} onChange={handleChange}>
              <option value="">{t("viform.select")}</option>
              <option value="low">{t("viform.adultsMore")}</option>
              <option value="medium">{t("viform.adultsOne")}</option>
              <option value="high">{t("viform.adultsNone")}</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>{t("viform.educationLegend")}</legend>
          <div id="educationLevelField">
            <label htmlFor="educationLevel">{t("viform.highestEducation")}</label>
            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
              <option value="" disabled>{t("viform.selectEducation")}</option>
              <option value="Above_post_graduate">{t("viform.abovePG")}</option>
              <option value="post_graduate">{t("viform.pg")}</option>
              <option value="graduate">{t("viform.graduate")}</option>
              <option value="ssc">{t("viform.ssc")}</option>
              <option value="below_10th">{t("viform.below10")}</option>
            </select>
          </div>

          {(formData.educationLevel === "below_10th") && (formData.age < 25) &&
            <label htmlFor="enrolled">{t("viform.currentlyEnrolled")}
              <select id="enrolled" name="enrolled" onChange={handleChange}>
                <option value="" disabled>{t("viform.selectAnswer")}</option>
                <option value="yes">{t("viform.yes")}</option>
                <option value="no">{t("viform.no")}</option>
              </select>
            </label>
          }
        </fieldset>

        <fieldset>
          <legend>{t("viform.genderLegend")}</legend>
          <label>{t("viform.gender")}
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">{t("viform.select")}</option>
              <option value="male">{t("viform.male")}</option>
              <option value="female">{t("viform.female")}</option>
              <option value="Other">{t("viform.other")}</option>
            </select>
          </label>
          {formData.gender === "female" && (
            <label>{t("viform.pregnant")}
              <select name="pregnant" value={formData.pregnant} onChange={handleChange}>
                <option value="">{t("viform.select")}</option>
                <option value="Yes">{t("viform.yes")}</option>
                <option value="No">{t("viform.no")}</option>
              </select>
            </label>
          )}
        </fieldset>

        <fieldset>
          <legend>{t("viform.healthLegend")}</legend>
          <label htmlFor="chronic_issues">{t("viform.chronicIssues")}
            <select id="chronic_issues" name="chronicIssues" value={formData.chronicIssues} required onChange={handleChange}>
              <option value="" disabled>{t("viform.selectChronicStatus")}</option>
              <option value="yes">{t("viform.yes")}</option>
              <option value="no">{t("viform.no")}</option>
            </select>
          </label>

          {(formData.chronicIssues === "no") &&
            <label>{t("viform.acuteHospitalization")}
              <select id="hospitalization" name="hospitalization" value={formData.hospitalization} onChange={handleChange}>
                <option value="" disabled>{t("viform.selectChronicStatus")}</option>
                <option value="low">{t("viform.hospMore2Years")}</option>
                <option value="medium">{t("viform.hosp1to2Years")}</option>
                <option value="high">{t("viform.hosp1Year")}</option>
              </select>
            </label>
          }
        </fieldset>

        <fieldset>
          <legend>{t("viform.medicationLegend")}</legend>
          <label>{t("viform.medication")}
            <select name="medication" value={formData.medication} onChange={handleChange}>
              <option value="">{t("viform.select")}</option>
              <option value="no_medication">{t("viform.no")}</option>
              <option value="yes_medication">{t("viform.yes")}</option>
              <option value="not_sure">{t("viform.notSure")}</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>{t("viform.disabilityLegend")}</legend>
          <label>{t("viform.disability")}
            <select name="disability" value={formData.disability} onChange={handleChange}>
              <option value="">{t("viform.select")}</option>
              <option value="no">{t("viform.no")}</option>
              <option value="yes">{t("viform.yes")}</option>
            </select>
          </label>

          {formData.disability === "yes" && (
            <label>{t("viform.benchmarkDisability")}
              <select name="benchmarkDisability" value={formData.benchmarkDisability} onChange={handleChange}>
                <option value="">{t("viform.select")}</option>
                <option value="Above">{t("viform.aboveStandard")}</option>
                <option value="Below">{t("viform.belowStandard")}</option>
              </select>
            </label>
          )}
        </fieldset>

        <button type="submit">{t("viform.submit")}</button>
        <button type="button" onClick={handleCancel}>{t("viform.cancel")}</button>
      </form>
    </div>
  );
};

export default VIFORM;
