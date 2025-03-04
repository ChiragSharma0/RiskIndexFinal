const authCheck = (req, res) => {
    // If this function runs, token was verified successfully
    res.status(200).json({
        message: 'Token is valid. Redirecting to dashboard.',
        user: req.user // Send user data to frontend
    });
};

module.exports = { authCheck };
