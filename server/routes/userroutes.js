const express = require('express');
const UTCIData = require('../models/riskdata')
const GeoUTCIData = require("../models/userdata")
const { getUserData, getVIdata, getEIdata, findSchedule } = require('../API/userdata');
const router = express.Router();




router.post('/userdata', getUserData);
router.post('/vidata', getVIdata);
router.post('/eidata', getEIdata);
router.post('/schedule', findSchedule);
// Timestamp helper
const timestamp = () => {
  const now = new Date();
  return `[${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}]`;
};

router.post("/getutci", async (req, res) => {
  try {
    console.log("📡 Received UTCI request:", req.body);

    let { homeLocation, workLocation, travelLocation, date, homeHrs, workHrs, time } = req.body;

    // 🛑 Validate Request Data
    if (!homeLocation || !workLocation || !travelLocation || date === undefined || time === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(homeHrs) || !Array.isArray(workHrs) || typeof time !== "number") {
      return res.status(400).json({ error: "Invalid data format" });
    }

    console.log(`🏠 Home Location:`, homeLocation);
    console.log(`🏢 Work Location:`, workLocation);
    console.log(`🛣️ Travel Location:`, travelLocation);
    console.log(`📆 Starting Date: ${date}, Starting Time: ${time}`);

    // ✅ Generate UTCI Keys for Next 24 Hours
    let utcKeys = [];
    let d = parseInt(date); // Convert date to integer
    for (let i = 0; i < 24; i++) {
      let hour = (time + i) % 24;
      let dayOffset = (time + i) >= 24 ? 1 : 0; // Move to the next day after 23:59
      let currentDay = d + dayOffset;

      // 🔄 **Fix for missing data before `10_12`**
      if (currentDay === 10 && hour < 12) {
        currentDay = 11; // Move to next day
      }

      utcKeys.push(`UTCI_${String(currentDay).padStart(2, "0")}_${String(hour).padStart(2, "0")}`);
    }

    console.log(`📆 UTCI Keys for Next 24 Hours:`, utcKeys);

    // ✅ Function to Fetch UTCI Data
    const fetchUTCI = async (lat, lng, keys) => {
      if (!lat || !lng || !keys.length) return [];

      console.log(`📍 Fetching UTCI for lat: ${lat}, lon: ${lng}, keys:`, keys);

      let data = await GeoUTCIData.findOne({
        location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 10 } },
      }) || await GeoUTCIData.findOne({
        location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 10000 } },
      }) || await GeoUTCIData.findOne({
        location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 1000000 } },
      });

      if (!data) {
        console.warn(`❌ No UTCI data found for lat: ${lat}, lon: ${lng}`);
        return [];
      }

      console.log("✅ Found UTCI Data:", data.UTCI);

      return keys.map((key) => {
        let [_, day, hour] = key.split("_"); // Extract day and hour from key
        let value = data?.UTCI?.get(key) ?? null;

        if (value === null) {
          console.warn(`⚠️ UTCI data missing for key: ${key}`);
        }

        return { day, hour, value };
      }).filter(entry => entry.value !== null); // Remove null values
    };

    // 🔄 Determine Transit Hours
    const allHrs = new Set(utcKeys.map(k => parseInt(k.split("_")[2], 10)));
    const transitHrs = [...allHrs].filter((hr) => !homeHrs.includes(hr) && !workHrs.includes(hr));

    console.log(`⏳ Fetching UTCI data...`);

    // 🌍 Fetch UTCI Data for Home, Work, and Travel Locations
    const [homeUTCI, workUTCI, transitUTCI] = await Promise.all([
      fetchUTCI(homeLocation.lat, homeLocation.lng, homeHrs.map(h => {
        let hour = h;
        let day = d;
        if (day === 10 && hour < 12) day = 11; // Shift to next day if needed
        return `UTCI_${String(day).padStart(2, "0")}_${String(hour).padStart(2, "0")}`;
      })),
      fetchUTCI(workLocation.lat, workLocation.lng, workHrs.map(h => {
        let hour = h;
        let day = d;
        if (day === 10 && hour < 12) day = 11; // Shift to next day if needed
        return `UTCI_${String(day).padStart(2, "0")}_${String(hour).padStart(2, "0")}`;
      })),
      fetchUTCI(travelLocation.lat, travelLocation.lng, transitHrs.map(h => {
        let hour = h;
        let day = d;
        if (day === 10 && hour < 12) day = 11; // Shift to next day if needed
        return `UTCI_${String(day).padStart(2, "0")}_${String(hour).padStart(2, "0")}`;
      })),
    ]);

    console.log("🏠 Home UTCI:", homeUTCI);
    console.log("🏢 Work UTCI:", workUTCI);
    console.log("🛣️ Travel UTCI:", transitUTCI);

    // 🔹 Combine and Sort Data
    const allUTCI = [...homeUTCI, ...workUTCI, ...transitUTCI]
      .filter(entry => entry.value !== null)  // Remove missing values
      .sort((a, b) => (parseInt(a.day) * 24 + parseInt(a.hour)) - (parseInt(b.day) * 24 + parseInt(b.hour))); // Sort by date & hour

    console.log(`✅ Final UTCI Data:`, allUTCI);

    res.json({ utciData: allUTCI });

  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;

