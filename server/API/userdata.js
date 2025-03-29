const User = require('../models/user');
const UTCIData = require("../models/riskdata"); // Import your model

require('dotenv').config();



// Fetch UserData (username, note, profile pic)

const getUserData = async (req, res) => {
    try {
        const { userid } = req.body;

        if (!userid) {
            return res.status(400).json({ message: 'Userid required' });
        }

        const user = await User.findOne({ UserID: userid }).select('UserName NOTE profilepic -_id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User data retrieved', user });

    } catch (error) {
        console.error('🔥 Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch VIdata
const getVIdata = async (req, res) => {
    try {
        const { userid } = req.body;

        if (!userid) {
            return res.status(400).json({ message: 'Userid required' });
        }

        const user = await User.findOne({ UserID: userid }).select('VIdata -_id');

        if (!user || !user.VIdata) {
            return res.status(404).json({ message: 'VIdata not found' });
        }

        // Remove `_id` from inside `VIdata`
        const filteredVIdata = user.VIdata.toObject(); // Convert to plain object
        delete filteredVIdata._id; // Remove `_id` from VIdata

        res.status(200).json({ message: 'VIdata retrieved', VIdata: filteredVIdata });

    } catch (error) {
        console.error('🔥 Error fetching VIdata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Fetch EIdata
const getEIdata = async (req, res) => {
    try {
        const { userid } = req.body;

        if (!userid) {
            return res.status(400).json({ message: 'Userid required' });
        }

        const user = await User.findOne({ UserID: userid }).select('EIdata -_id');

        if (!user || !user.EIdata) {
            return res.status(404).json({ message: 'EIdata not found' });
        }

        const filteredVIdata = user.EIdata.toObject(); // Convert to plain object
        delete filteredVIdata._id; // Remove `_id` from VIdata
        res.status(200).json({ message: 'EIdata retrieved', EIdata: filteredVIdata });

    } catch (error) {
        console.error('🔥 Error fetching EIdata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const findSchedule = async (req, res) => {
  try {
    const { userid } = req.body;
    console.log("\n\n\n\n\n\n\\n\n\n\n\\n\n\n\\n\🔍 [FIND SCHEDULE] Request received");
    console.log("   📨 Payload:", { userid });

    if (!userid) {
      console.warn("⚠️ [FIND SCHEDULE] Missing userid in request body");
      return res.status(400).json({ message: "Userid is required" });
    }

    console.log("🔎 [FIND SCHEDULE] Searching for user in database...");
    const user = await User.findOne(
      { UserID: userid },
      { schedule: 1, _id: 0 } // Only return the schedule
    );

    if (!user) {
      console.warn("❌ [FIND SCHEDULE] User not found:", userid);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.schedule) {
      console.warn("⚠️ [FIND SCHEDULE] No schedule data found for user:", userid);
      return res.status(404).json({ message: "Schedule not found" });
    }

    console.log("✅ [FIND SCHEDULE] Schedule found:", user.schedule);
    res.status(200).json({
      schedule: {
        work: user.schedule.work,
        home: user.schedule.home,
        useCustom: user.schedule.useCustom, // Ensure `useCustom` is always included
      },
    });

  } catch (error) {
    console.error("🔥 [FIND SCHEDULE] Error fetching schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// Function to generate MM:SS timestamp
const getTimestamp = () => {
    const now = new Date();
    return `[${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}]`;
  };
  
  // Function to find the closest location
  const findNearestCoordinates = async (latitude, longitude) => {
    console.log(`${getTimestamp()} 🔎 Starting nearest coordinate search for (${latitude}, ${longitude})`);
  
    const allRecords = await UTCIData.find({});
    console.log(`${getTimestamp()} 📦 Fetched ${allRecords.length} records from database`);
  
    let nearest = null;
    let minDistance = Infinity;
  
    allRecords.forEach((record, index) => {
      const distance = Math.sqrt(
        Math.pow(record.Latitude - latitude, 2) + Math.pow(record.Longitude - longitude, 2)
      );
  
      if (distance < minDistance) {
        minDistance = distance;
        nearest = record;
        console.log(`${getTimestamp()} 🧭 New nearest found at index ${index} with distance ${distance.toFixed(5)}`);
      }
    });
  
    if (nearest) {
      console.log(`${getTimestamp()} ✅ Nearest coordinate found: (${nearest.Latitude}, ${nearest.Longitude})`);
    } else {
      console.log(`${getTimestamp()} ❌ No nearest coordinate found`);
    }
  
    return nearest;
  };
  

// API endpoint



 

module.exports = { getUserData, getVIdata, getEIdata, findNearestCoordinates , findSchedule};
 