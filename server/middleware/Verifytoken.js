const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    console.log(`\n🔍 [Auth Middleware] Checking token at ${new Date().toISOString()}`);

    try {
        if (!req.cookies) {
            console.log(`❌ No cookies found.`);
            return res.status(401).json({ message: 'Unauthorized: No cookies found' });
        }

        const token = req.cookies.token; // ✅ Get token from cookies
        console.log(`🔹 Retrieved Token: ${token ? token.substring(0, 10) + '...' : 'No Token Found'}`);

        if (!token) {
            console.log(`❌ No token provided.`);
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Ensure JWT_SECRET is defined
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error('⚠️ JWT_SECRET is not defined in environment variables!');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Verify token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(`❌ Invalid or expired token: ${err.message}`);
                return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
            }

            console.log(`✅ Token Verified! User ID: ${decoded.id}`);
            req.user = { id: decoded.id }; // ✅ Attach user data to request
            
            next(); // ✅ Proceed to the next middleware/route
        });

    } catch (error) {
        console.error(`🔥 Unexpected Error in verifyToken:`, error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = verifyToken;
