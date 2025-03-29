import React, { createContext, useState, useContext, useEffect } from "react";
import { useSchedule } from "./schedule";

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {

  const {schedule} = useSchedule();
  

  const [date, setDate] = useState({
    date: 10,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [time, setTime] = useState({
    hrs: 12,
    min: 0o0,
    sec: 0o0,
  });

  const setFormattedTime = ({ hrs, min, sec }) => {
    setTime({
      hrs: formatTwoDigits(hrs),
      min: formatTwoDigits(min),
      sec: formatTwoDigits(sec),
    });
  };


  
  



  

  



  // Get the user's current Time
  

  const formatTwoDigits = (num) => String(num).padStart(2, "0");









  return (
    <TimeContext.Provider
      value={{
        date,
        setDate,  // ✅ Directly passing the state updater
        time,
        setTime, // ✅ replaces raw setTime
       
  
      }}
    >
      {children}
    </TimeContext.Provider>
  );

};

export const useTimeContext = () => useContext(TimeContext);
