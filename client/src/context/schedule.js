import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ScheduleContext = createContext();

// Define task schedule based on hours
const schedule = {
    atWork: { start: 9, end: 17 },
    traveling: { start: [8, 17], end: [9, 18] },
    atHome: { start: 0, end: 24 }
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
        if (hour >= schedule.atWork.start && hour < schedule.atWork.end) return "At Work";
        if ((hour >= schedule.traveling.start[0] && hour < schedule.traveling.end[0]) ||
            (hour >= schedule.traveling.start[1] && hour < schedule.traveling.end[1])) return "Traveling";
        return "At Home";
    }

    return (
        <ScheduleContext.Provider value={{ currentTask }}>
            {children}
        </ScheduleContext.Provider>
    );
};

// Hook to use Schedule Context
export const useSchedule = () => {
    return useContext(ScheduleContext);
};
