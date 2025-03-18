import React, { useState } from "react";
import axios from "axios";
import { useSchedule } from "../../context/schedule";
import "./form.css";

const url = process.env.REACT_APP_UPDATE_Schedule;

const ScheduleForm = () => {
  const { schedule, setSchedule } = useSchedule();

  const [workTime, setWorkTime] = useState(schedule.workTime);
  const [homeTime, setHomeTime] = useState(schedule.homeTime);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Submit schedule triggered");

    const userid = localStorage.getItem("userid");
console.log(workTime,homeTime);
    if (!userid) {
      return setError("User ID not found.");
    }

    if (workTime.start === workTime.end || homeTime.start === homeTime.end) {
      return setError("Start and end times must be different.");
    }

    try {
      const res = await axios.post(url, {
        userid,
        schedule: { workTime, homeTime },
      });

      if (res.data && res.data.updatedSchedule) {
        const updated = res.data.updatedSchedule;
        console.log("✅ Updated schedule received:", updated);

        const toTimeStr = (h) => `${h.toString().padStart(2, "0")}:00`;

        const newSchedule = {
          workTime: {
            start: toTimeStr(updated.work.start),
            end: toTimeStr(updated.work.end),
          },
          homeTime: {
            start: toTimeStr(updated.residence.start),
            end: toTimeStr(updated.residence.end),
          },
        };

        setSchedule(newSchedule);
        setWorkTime(newSchedule.workTime);
        setHomeTime(newSchedule.homeTime);
        setError("");
        alert("✅ Schedule updated successfully!");
      } else {
        console.warn("⚠️ No updated schedule received from server.");
        setError("Failed to update schedule. Try again.");
      }
    } catch (err) {
      console.error("🔥 Error updating schedule:", err);
      setError("Failed to update schedule.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set Custom Schedule</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Work Start Time:</label>
        <input
          type="time" style={{width:"auto"}}
          value={workTime.start}
          onChange={(e) => setWorkTime({ ...workTime, start: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Work End Time:</label>
        <input
          type="time" style={{width:"auto"}}
          value={workTime.end}
          onChange={(e) => setWorkTime({ ...workTime, end: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Home Start Time:</label>
        <input
          type="time" style={{width:"auto"}}
          value={homeTime.start}
          onChange={(e) => setHomeTime({ ...homeTime, start: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Home End Time:</label>
        <input
          type="time" style={{width:"auto"}}
          value={homeTime.end}
          onChange={(e) => setHomeTime({ ...homeTime, end: e.target.value })}
          required
        />
      </div>

      <button type="submit">Save Schedule</button>
    </form>
  );
};

export default ScheduleForm;
