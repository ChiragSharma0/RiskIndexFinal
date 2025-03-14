const express = require('express');


const {updateUserData,updateEIdata,updateVIdata,updateLocation,updateSchedule,updateScheduleStatus} = require("../API/Update");

const router = express.Router();

// Register route with validation
router.post('/user',updateUserData);
router.post('/EI',updateEIdata);
router.post('/VI',updateVIdata);
router.post('/location',updateLocation);
router.post('/schedule',updateSchedule);
router.post('/schedulestatus',updateScheduleStatus);
module.exports = router;
