import { createContext, useContext, useState, useEffect } from "react";
import { useLocationContext } from "./locationcontext";
import axios from "axios"; // Make sure this is imported at the top
import React from "react";
import { useTranslation } from "react-i18next";
const url = process.env.REACT_APP_FETCH_SCHEDULE;
const ScheduleContext = createContext();

const timeToHrs = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

export const ScheduleProvider = ({ children }) => {
  const { t } = useTranslation();
  const { time } = useLocationContext(); // Get current time from LocationContext
  const [scheduleType, setScheduleType] = useState("default");
  const [schedule, setSchedule] = useState({
    workTime: { start: "09:00", end: "17:00" },
    homeTime: { start: "17:00", end: "07:00" }, // overnight
    
  });

  const [currentTask, setCurrentTask] = useState(getCurrentTask());
  useEffect(() => {
    console.log("triggering change task\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    const task = getCurrentTask();
    setCurrentTask(task);
    console.log(task);
  }, [time, schedule]); // runs every time `time` changes
  // 🔄 Fetch schedule from backend on mount

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const userid = localStorage.getItem("userid");
        if (!userid) return console.warn("⚠️ No userid found in localStorage");

        console.log("📡 Initiating schedule fetch...");

        const response = await axios.post(`${url}`, { userid });

        const data = response.data;
        console.log("📥 Schedule fetched:", data);

        if (data.schedule) {
          const { work, residence, useCustom } = data.schedule;

          const toTimeStr = (h) => `${h.toString().padStart(2, "0")}:00`;

          setSchedule({
            workTime: {
              start: toTimeStr(work.start),
              end: toTimeStr(work.end),
            },
            homeTime: {
              start: toTimeStr(residence.start),
              end: toTimeStr(residence.end),
            },
          });

          setScheduleType(useCustom ? "custom" : "default");
        }
      } catch (err) {
        console.error("🔥 Failed to fetch schedule:", err);
      }
    };

    fetchSchedule();
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", currentTask);

  }, []);


  function getCurrentTask() {
    const hrs = time?.hrs ?? 0;
    console.log("current hrs", hrs);
    const workStart = timeToHrs(schedule.workTime.start);
    const workEnd = timeToHrs(schedule.workTime.end);
    const homeStart = timeToHrs(schedule.homeTime.start);
    const homeEnd = timeToHrs(schedule.homeTime.end);

    if (hrs >= workStart && hrs < workEnd) return "Workplace";

    if (homeStart < homeEnd) {
      if (hrs >= homeStart && hrs < homeEnd) return "Residence";
    } else {
      if (hrs >= homeStart || hrs < homeEnd) return "Residence";
    }

    return "Traveling";
  }

  return (
    <ScheduleContext.Provider
      value={{
        currentTask,
        scheduleType,
        setScheduleType,
        schedule,
        setSchedule
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
