const express = require('express');


const {updateUserData,updateEIdata,updateVIdata,updateLocation} = require("../API/Update");

const router = express.Router();

// Register route with validation
router.post('/user',updateUserData);
router.post('/EI',updateEIdata);
router.post('/VI',updateVIdata);
router.post('/location',updateLocation);

module.exports = router;
