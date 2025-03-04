const express = require('express');
const { connectDB } = require('./config/db'); // MongoDB connection
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',  // ✅ Your frontend origin
    credentials: true                 // ✅ Allow cookies to be sent
}));


app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Fixed this line ✅
  
// Routes
const apiRoutes = require('./routes/APIRoutes'); // Import all API routes
app.use('/api', apiRoutes); 
 
// Home page route
app.get('*', (req, res) => {
    res.send("Welcome to the API!");
});

// Start server
console.log(process.listeners('exit'));

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


























