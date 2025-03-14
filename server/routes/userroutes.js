const express = require('express');
const UTCIData = require('../models/riskdata')
const GeoUTCIData = require("../models/userdata")
const { getUserData, getVIdata, getEIdata,  findSchedule} = require('../API/userdata');
const router = express.Router();




router.post('/userdata', getUserData);
router.post('/vidata', getVIdata);
router.post('/eidata', getEIdata);
router.post('/schedule',findSchedule);
// Timestamp helper
const timestamp = () => {
  const now = new Date();
  return `[${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}]`;
};

router.post("/getutci", async (req, res) => {
  try {
    let { latitude, longitude, date, hour } = req.body;

    if (!latitude || !longitude || date === undefined || hour === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    // Generate 24 UTCI keys: UTCI_13_23, UTCI_14_00, ..., UTCI_14_22
    const utciKeys = [];
    let d = parseInt(date);
    let h = parseInt(hour);

    for (let i = 0; i < 24; i++) {
      const key = `UTCI_${String(d).padStart(2, "0")}_${String(h).padStart(2, "0")}`;
      utciKeys.push(key);

      h++;
      if (h === 24) {
        h = 0;
        d++;
      }
    }

    console.log(`${timestamp()} 🔍 UTCI keys for next 24h:`, utciKeys);

    // Search for location in DB (within 1m or fallback to 10km)
    let data = await GeoUTCIData.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10,
        },
      },
    });

    if (!data) {
      data = await GeoUTCIData.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 1000000,
          },
        },
      });

      if (!data) {
        return res.status(404).json({ error: "No data available nearby" });
      }
    }

    // Get UTCI values for all 24 keys
    const utciNext24Hours = utciKeys.map((key) => {
      return {
        key,
        value: data.UTCI.get(key) ?? null,
      };
    });

    // Return the first value separately as current
    const currentUTCI = utciNext24Hours[0]?.value ?? null;

    res.json({
      latitude: data.location.coordinates[1],
      longitude: data.location.coordinates[0],
      currentUTCI,
      utciNext24Hours,
    });

  } catch (err) {
    console.error(`${timestamp()} ❌ Server error:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;

