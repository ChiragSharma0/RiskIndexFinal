const User = require('../models/user');
require('dotenv').config();

const checkUserExists = async (req, res) => {
    try {
        const { userid } = req.body; // Ensure `req.body` is used for POST requests

        if (!userid) {
            return res.status(400).json({ exists: false, message: 'Userid required' });
        }

        // Check if user exists
        const userExists = await User.exists({ UserID: userid });

        res.status(userExists ? 200 : 404).json({
            exists: Boolean(userExists),
            message: userExists ? 'User exists' : 'User not found'
        });

    } catch (error) {
        console.error('🔥 Error checking user existence:', error);
        res.status(500).json({ exists: false, message: 'Internal Server Error' });
    }
};

module.exports = { checkUserExists };
