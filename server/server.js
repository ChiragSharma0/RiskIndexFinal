const express = require('express');
const { connectDB } = require('./config/db'); // MongoDB connection
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Define your frontend domain (Update this to match your actual domain)
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://yourdomain.com';

// Middleware
const allowedOrigins = [
  "https://hsrif.com",
  "https://www.hsrif.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

 
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Enable cookie parsing

// Routes
const apiRoutes = require('./routes/APIRoutes'); // Import all API routes
app.use('/api', apiRoutes); 

// Home page route
app.get('*', (req, res) => {
    res.send("Welcome to the API!");
});

// Start server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
