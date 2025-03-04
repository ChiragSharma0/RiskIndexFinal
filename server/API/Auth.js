
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid'); // Import UUID

// Register new user
const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Validate input fields
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert email to lowercase to prevent duplicate case-sensitive entries
    email = email.toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }


    // Create and save user with UUID
    const newUser = new User({ 
      UserID: uuidv4(), // Generate UUID for UserID
      UserName: username,  
      email, 
      password 
    });
    
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);

    // Handle duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔹 Login request received:', { email, password });

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log('❌ No user found with this email.');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Log stored hashed password & incoming plaintext password
        console.log("🔹 Stored Hashed Password:", user.password);
        console.log("🔹 User Input Password (Plaintext):", password); 

        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("🔹 Password Match Result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Password is incorrect.');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        
        

        console.log('✅ Login successful,saved to localstorage');
        res.status(200).json({ message: 'Login successful', username: user.UserName ,userid :user.UserID});

    } catch (error) {
        console.error('🔥 Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = { loginUser ,registerUser};
