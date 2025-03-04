const express = require('express');
const UTCIData = require('../models/riskdata')
const { getUserData, getVIdata, getEIdata,findNearestCoordinates } = require('../API/userdata');
const router = express.Router();

router.post('/userdata', getUserData);
router.post('/vidata', getVIdata);
router.post('/eidata', getEIdata);
router.post("/getutci", async (req, res) => {
    let { latitude, longitude, utciKey } = req.body;
    console.log(latitude,"AND",longitude,"and",utciKey)
    if (!latitude || !longitude || !utciKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    let data = await UTCIData.findOne({ 
        Latitude: parseFloat(latitude), 
        Longitude: parseFloat(longitude) 
      });
    if (!data) {
        data = await findNearestCoordinates(Number(latitude), Number(longitude));
        console.log(data)
        if (!data) {
            return res.status(404).json({ error: "No data available here " });
        }
    }
    
    const utciValue = data.UTCI.get(utciKey);
    
    if (utciValue === undefined) {
        return res.status(404).json({ error: "UTCI key not found" });
    }
    
    res.json({ latitude: data.latitude, longitude: data.longitude, utciValue });
});

module.exports = router;
