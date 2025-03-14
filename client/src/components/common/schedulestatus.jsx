import React, { useState } from "react";
import axios from "axios";
import  {useSchedule}  from "../../context/schedule";
const url = process.env.REACT_APP_UPDATE_Schedulestatus;

const ScheduleDropdown = () => {
  const { scheduleType, setScheduleType } = useSchedule();

  const [selectedType, setSelectedType] = useState(scheduleType);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDropdownChange = (e) => {
    setSelectedType(e.target.value);
    setShowConfirm(true);
  };
  const userid = localStorage.getItem("userid");

  const handleConfirm = async () => {
    const useCustom = selectedType === "custom";

    try {
      await axios.post(`${url}`, {
        userid,
        useCustom,
      });

      setScheduleType(selectedType);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error updating schedule status:", error);
      alert("Failed to update schedule status.");
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={scheduleType}
        onChange={handleDropdownChange}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px 12px",
          outline: "none",
        }}
      >
        <option value="default">Default Schedule</option>
        <option value="custom">Custom Schedule</option>
      </select>

      {showConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            width: "300px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Confirm Change</h3>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              Changing the schedule type requires a page refresh. Do you want to continue?
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDropdown;
