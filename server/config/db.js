const mongoose = require('mongoose');
require('dotenv').config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI, { });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Function to search for UTCI value based on latitude, longitude, and UTCI key

module.exports = { connectDB };
 