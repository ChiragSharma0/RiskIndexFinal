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







// Function to find the closest location
const findNearestCoordinates = async (latitude, longitude) => {
    const allRecords = await UTCIData.find({});
    let nearest = null;
    let minDistance = Infinity;

    allRecords.forEach(record => {
        const distance = Math.sqrt(
            Math.pow(record.Latitude - latitude, 2) + Math.pow(record.Longitude - longitude, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = record;
        }
    });

    return nearest;
};

// API endpoint





module.exports = { getUserData, getVIdata, getEIdata, findNearestCoordinates };
 