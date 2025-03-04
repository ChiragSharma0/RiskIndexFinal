const express = require('express');
const validateRegister = require('../middleware/validateregister'); // Middleware for validation
const verifyToken = require('../middleware/Verifytoken');


const {loginUser,registerUser} = require('../API/Auth');
const { checkUserExists } = require("../API/searchuser"); // ✅ Import function

const router = express.Router();





// Register route with validation
router.post('/register', validateRegister, async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
router.post('/login',loginUser);

/* router.get("/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});  */

router.post('/verify', checkUserExists); // ✅ Correctly using POST

module.exports = router;
