const express = require('express');
const authRoutes = require('./authRoutes'); // Import authentication routes
const UpdateRoutes = require('./updateRoutes'); // Import risk-related routes
const userRoutes = require('./userroutes');
const router = express.Router();

// Use the imported routes
router.use('/auth', authRoutes); // Auth routes
router.use('/update', UpdateRoutes); // Risk routes
router.use('/find', userRoutes); // ✅ This means `/find/user` should work




router.use((req, res) => {
    res.status(404).json({ message: 'API route not found from api routes' });
  });
    
module.exports = router; 
