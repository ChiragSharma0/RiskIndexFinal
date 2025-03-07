import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ScheduleContext = createContext();

// Define task schedule based on hours
const schedule = {
    atWork: { start: 9, end: 17 }, // 9 AM - 5 PM
    traveling: { start: [8, 17], end: [9, 18] }, // 8-9 AM & 5-6 PM
    atHome: { start: 0, end: 24 } // Always when not working or traveling
};

// Context Provider
export const ScheduleProvider = ({ children }) => {
    const [currentTask, setCurrentTask] = useState(getCurrentTask());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTask(getCurrentTask());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    function getCurrentTask() {
        const hour = new Date().getHours();
        const { start: workStart, end: workEnd } = schedule.atWork;
        const { start: travelStart, end: travelEnd } = schedule.traveling;

        if (hour >= workStart && hour < workEnd) return "Workplace";
        if ((hour >= travelStart[0] && hour < travelEnd[0]) ||
            (hour >= travelStart[1] && hour < travelEnd[1])) return "Traveling";

        return "Residence";
    }

    return (
        <ScheduleContext.Provider value={{ currentTask }}>
            {children}
        </ScheduleContext.Provider>
    );
};

// Hook to use Schedule Context
export const useSchedule = () => useContext(ScheduleContext);
