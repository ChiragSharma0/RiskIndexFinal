import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const url = process.env.REACT_APP_FETCH_SCHEDULE;
const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {

  const [scheduleType, setScheduleType] = useState("default");
  const [schedule, setSchedule] = useState({
    work: { hrs: [9, 10, 11, 12, 13, 14, 15, 16], location: [] },
    home: { hrs: [17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7], location: [] },
    useCustom: false,
  });

 
  // 🔄 Fetch schedule from backend on mount
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const userid = localStorage.getItem("userid");
        if (!userid) {
          console.warn("⚠️ No userid found in localStorage");
          return;
        }
  
        console.log("📡 Initiating schedule fetch...");
        const response = await axios.post(`${url}`, { userid });
        let schedule = response.data.schedule;
        console.log("📥 Schedule fetched:", schedule);
  
        if (schedule) {
          let { work, home, useCustom } = schedule;
  
          console.log(work,home,useCustom);
  
          // ✅ Use custom schedule if available, otherwise apply default
          if (useCustom) {
            setSchedule({ work, home, useCustom });
            setScheduleType("custom");
          } else {
            setSchedule({
              work: { hrs: [9, 10, 11, 12, 13, 14, 15, 16,17], location: [] },
              home: { hrs: [ 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7], location: [] },
              useCustom: false,
            });
            setScheduleType("default");
          }
        }
      } catch (err) {
        console.error("🔥 Failed to fetch schedule:", err);
      }
    };
  
    fetchSchedule();
  }, []);
  
  

  

  
  

  return (
    <ScheduleContext.Provider
      value={{
        
        scheduleType,
        setScheduleType,
        schedule,
        setSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
