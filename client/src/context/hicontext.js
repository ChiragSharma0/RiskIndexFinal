import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSchedule } from "./schedule";
import { useLocationContext } from "./locationcontext";
import { useTimeContext } from "./timecontext";

const url = process.env.REACT_APP_FETCH_LOCATION;

export const HIContext = createContext();

export const HIProvider = ({ children }) => {
  const { time, date } = useTimeContext();
  const { schedule } = useSchedule();
  const { currentLocation } = useLocationContext();

  const [HIfinal, setHifinal] = useState(0.0);
  const [utciArray, setUtciArray] = useState([]);

  const normalizeUTCI = (T) => {
    if (T === null || T === undefined) return 0.0; 
    const categories = [
      { min: 9, max: 26, min_cat: 0.0, max_cat: 0.25 },
      { min: 26, max: 32, min_cat: 0.25, max_cat: 0.5 },
      { min: 32, max: 38, min_cat: 0.5, max_cat: 0.75 },
      { min: 38, max: 46, min_cat: 0.75, max_cat: 1.0 },
      { min: 46, max: Infinity, min_cat: 1.0, max_cat: 1.0 },
    ];
    const category = categories.find((cat) => T >= cat.min && T < cat.max);
    if (!category) return 0.0;
    const { min, max, min_cat, max_cat } = category;
    return min_cat + ((T - min) / (max - min)) * (max_cat - min_cat);
  };

  const updateHIFinal = async () => {
    if (!schedule?.home?.location || !schedule?.work?.location || !currentLocation) {
      console.warn("⚠️ Missing required schedule or location data", { schedule, currentLocation });
      return;
    }
    const TIme = Number(time.hrs);  // Ensure it's a number

    const requestBody = {
      homeLocation: schedule.home.location,
      workLocation: schedule.work.location,
      travelLocation: currentLocation,
      date: date.date,
      time:TIme,
      homeHrs: schedule.home.hrs || [],
      workHrs: schedule.work.hrs || [],
    };


console.log("📡 Sending UTCI request with:", requestBody);


    console.log("📡 Fetching UTCI data from:", url, requestBody);
    try {
      const response = await axios.post(url, requestBody);
      const { utciData } = response.data;

      if (!utciData || !Array.isArray(utciData) || utciData.length === 0) {
        console.warn("⚠️ No UTCI data received");
        return;
      }

      const normalizedArray = utciData.map((utci) => normalizeUTCI(utci.value)).filter((val) => val !== null);
      
      if (normalizedArray.length > 0) {
        setHifinal(normalizedArray[0]);
      }
      
      setUtciArray(normalizedArray);
      console.log("📊 Normalized UTCI values:", normalizedArray);
    } catch (error) {
      console.error("❌ Failed to fetch UTCI:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    updateHIFinal();
  }, [schedule, currentLocation, time]);

  return <HIContext.Provider value={{ HIfinal, utciArray, updateHIFinal }}>{children}</HIContext.Provider>;
};

export const useHIContext = () => useContext(HIContext);
