import React, { createContext, useState, useContext, useEffect } from "react";
import { useSchedule } from "./schedule";

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const { schedule } = useSchedule();

  // Local time states (IST)
  const [date, setDate] = useState({
    date: 10,
    month: 7,
    year: 2024,
  });

  const [time, setTime] = useState({
    hrs: 17,  // IST Hours
    min: 30,  // Always 30
    sec: 0,
  });

  // Convert IST to UTC
  const convertToUTC = (istHrs) => {
    let utcHrs = istHrs - 5; // Subtract 5 hours
    if (utcHrs < 0) utcHrs += 24; // Ensure it's within 0-23 range
    return utcHrs;
  };

  // Determine UTC date shift
  const getUTCDate = (istHrs, istDate) => {
    return istHrs < 5 ? istDate - 1 : istDate;  // If IST < 5AM, UTC is on the previous day
  };

  // UTC Time State
  const [utctime, setUtcTime] = useState({
    hrs: convertToUTC(time.hrs),  // Convert IST hrs to UTC
    min: 0,  // Always 00 in UTC as per your rule
    date: getUTCDate(time.hrs, date.date),  // Adjust UTC Date
  });

  // 🔄 Automatically update UTC time when IST `time.hrs` or `date.date` changes
  useEffect(() => {
    setUtcTime({
      hrs: convertToUTC(time.hrs),
      min: 0,  // Always 00 in UTC as per your rule
      date: getUTCDate(time.hrs, date.date),
    });

    console.log("⏳ Time Changed → IST:", time.hrs, "UTC:", utctime.hrs, "UTC Date:", utctime.date);
  }, [time.hrs, date.date]); // Runs whenever `time.hrs` or `date.date` changes

  return (
    <TimeContext.Provider
      value={{
        date,
        setDate,
        time,
        setTime,
        utctime,  // ✅ UTC Time Available
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTimeContext = () => useContext(TimeContext);
