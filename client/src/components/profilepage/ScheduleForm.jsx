import React, { useState, useEffect } from "react";
import LocationModal from "../Formelement/MapComponent"; // assumed map modal
import { useSchedule } from "../../context/schedule";
import axios from 'axios';
const timeSlots = Array.from({ length: 24 }, (_, i) => i);
const url = process.env.REACT_APP_UPDATE_Schedule

const formatTimeSlot = (index) => {
  const hour = Math.floor(index);
  const minute = "00" ;
  return `${hour}:${minute}`;
};

const categoryColors = {
  home: "#4caf50", // green
  work: "#2196f3", // blue
  travel: "#ffeb3b", // yellow
};

export default function ScheduleForm() {
  const { schedule, setSchedule, scheduleType, setScheduleType } = useSchedule();
  const [activeCategory, setActiveCategory] = useState("home");
  const [homeHrs, setHomeHrs] = useState(new Set(schedule.home.hrs));
  const [workHrs, setWorkHrs] = useState(new Set(schedule.work.hrs));
  const [homeLoc, setHomeLoc] = useState(schedule.home.location || {});
  const [workLoc, setWorkLoc] = useState(schedule.work.location || {});
  const [modalTarget, setModalTarget] = useState(null);

  useEffect(() => {
    setHomeHrs(new Set(schedule.home.hrs));
    setWorkHrs(new Set(schedule.work.hrs));
    setHomeLoc(schedule.home.location || {});
    setWorkLoc(schedule.work.location || {});
  }, [schedule]);

  const handleHourClick = async (hour) => {
    const newHomeHrs = new Set(homeHrs);
    const newWorkHrs = new Set(workHrs);

    if (activeCategory === "home") {
      newHomeHrs.add(hour);
      newWorkHrs.delete(hour);
    } else if (activeCategory === "work") {
      newWorkHrs.add(hour);
      newHomeHrs.delete(hour);
    } else {
      newHomeHrs.delete(hour);
      newWorkHrs.delete(hour);
    }

    setHomeHrs(newHomeHrs);
    setWorkHrs(newWorkHrs);
  };

  const getCategory = (hour) => {
    if (homeHrs.has(hour)) return "home";
    if (workHrs.has(hour)) return "work";
    return "travel";
  };

  const handleSave = async () => {
    console.log("Saving schedule..."); // Debug log
      const userid = localStorage.getItem("userid");
if (userid){
    const updatedSchedule = {
      home: { hrs: Array.from(homeHrs), location: homeLoc },
      work: { hrs: Array.from(workHrs), location: workLoc },
      useCustom: scheduleType === "custom",
    };
  
    console.log("UserID:", userid); // Debug log
    console.log("Updated Schedule:", updatedSchedule); // Debug log
  
    try {
      const response = await axios.post(url, { userid, schedule:updatedSchedule });
      console.log("Server Response:", response.data); // Debug log
  
      if (response.status === 200) { 
        setSchedule(updatedSchedule);
        console.log("Schedule updated successfully!");
      } else {
        console.error("Failed to update schedule:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Set Your Daily Schedule</h2>

      <div style={styles.categoryButtons}>
        {Object.keys(categoryColors).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              ...styles.catButton,
              backgroundColor: categoryColors[category],
              border: activeCategory === category ? "1px solid #333" : "none",
              boxShadow: activeCategory === category ? "rgba(22, 22, 22, 0.62) 6px 3px 8px" : "none",
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.hourGrid}>
        {timeSlots.map((hour) => (
          <div
            key={hour}
            onClick={() => handleHourClick(hour)}
            style={{
              ...styles.hourBox,
              backgroundColor: categoryColors[getCategory(hour)],
            }}
          >
            {formatTimeSlot(hour)}
          </div>
        ))}
      </div>

      <div style={styles.locationRow}>
        <div style={styles.card}>
          <h4>Home Location:</h4>
          <p>Lat: {homeLoc?.lat?.toFixed(4)}</p>
          <p>Lng: {homeLoc?.lng?.toFixed(4)}</p>
          <button style={styles.editButton} onClick={() => setModalTarget("home")}>
            Edit
          </button>
        </div>

        <div style={styles.card}>
          <h4>Work Location:</h4>
          <p>Lat: {workLoc?.lat?.toFixed(4)}</p>
          <p>Lng: {workLoc?.lng?.toFixed(4)}</p>
          <button style={styles.editButton} onClick={() => setModalTarget("work")}>
            Edit
          </button>
        </div>
      </div>

      <button style={styles.saveButton} onClick={handleSave}>Save Schedule</button>

      {modalTarget && (
        <LocationModal
          initial={modalTarget === "home" ? homeLoc : workLoc}
          onClose={() => setModalTarget(null)}
          onSave={(loc) => {
            modalTarget === "home" ? setHomeLoc(loc) : setWorkLoc(loc);
            setModalTarget(null);
          }}
        />
      )}
    </div>
  );
}


const styles = {
  container: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#eee",
    margin: "auto",
    boxSizing: "border-box"
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    textAlign: "center"
  },
  categoryButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  catButton: {
    flex: "1 1 100px",
    minWidth: "100px",
    padding: "0.6rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    textAlign: "center"
  },
  hourGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    width: "100%"
  },
  hourBox: {
    padding: "0.6rem 0",
    textAlign: "center",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #ccc",
    fontWeight: "bold",
    fontSize: "0.9rem"
  },
  locationRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  card: {
    flex: "1 1 250px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #ccc",
    fontSize: "0.9rem"
  },
  editButton: {
    marginTop: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem"
  },
  saveButton: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#2e7d32",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem"
  }
};



















