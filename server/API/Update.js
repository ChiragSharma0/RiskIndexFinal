const User = require('../models/user');
require('dotenv').config();

const updateUserData = async (req, res) => {
    try {
        const { userid, userdata } = req.body;
        console.log('🔹 Update UserData request received:', { userid, userdata });

        if (!userid || !userdata) {
            return res.status(400).json({ message: 'Userid and UserData required' });
        }

        // Extract only allowed fields
        const allowedUpdates = {};
        if (userdata.UserName !== undefined) allowedUpdates.UserName = userdata.UserName;
        if (userdata.NOTE !== undefined) allowedUpdates.NOTE = userdata.NOTE;
        if (userdata.profilepic !== undefined) allowedUpdates.profilepic = userdata.profilepic;

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { UserID: userid },
            { $set: allowedUpdates }, // Updates only allowed fields
            { new: true, select: "UserID UserName profilepic NOTE" } // Returns only necessary fields
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ UserData updated:', updatedUser);
        res.status(200).json({ message: 'UserData updated successfully', user: updatedUser });

    } catch (error) {
        console.error('🔥 Error updating UserData:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const updateEIdata = async (req, res) => {
    try {
        const { userid, eidata } = req.body;
        console.log('🔹 Update EIdata request received:', { userid, eidata });

        if (!userid || !eidata) {
            return res.status(400).json({ message: 'Userid and EIdata required' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { UserID: userid },
            { $set: { EIdata: eidata } }, // Only updates EIdata
            { new: true, select: "UserID EIdata" } // Returns only necessary fields
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ EIdata updated:', updatedUser.EIdata);
        res.status(200).json({ message: 'EIdata updated successfully', EIdata: updatedUser.EIdata });

    } catch (error) {
        console.error('🔥 Error updating EIdata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const updateVIdata = async (req, res) => {
    try {
        const { userid, vidata } = req.body;
        console.log('🔹 Update VIdata request received:', { userid, vidata });

        if (!userid || !vidata) {
            return res.status(400).json({ message: 'Userid and VIdata required' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { UserID: userid },
            { $set: { VIdata: vidata } }, // Only updates VIdata
            { new: true, select: "UserID VIdata" } // Returns only necessary fields
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ VIdata updated:', updatedUser.VIdata);
        res.status(200).json({ message: 'VIdata updated successfully', VIdata: updatedUser.VIdata });

    } catch (error) {
        console.error('🔥 Error updating VIdata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




// 📌 Update Residence or Workplace
const updateLocation = async (req, res) => {
    const { userid, residence, workplace } = req.body;

    if (!userid) return res.status(400).json({ error: "User ID is required" });

    try {
        let user = await User.findOne({ userid });

        if (!user) {
            // If user doesn't exist, create a new entry
            user = new User({ userid, residence, workplace });
        } else {
            // Update only provided fields
            if (residence) user.residence = residence;
            if (workplace) user.workplace = workplace;
        }

        await user.save();
        res.json({ message: "Location updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = { updateUserData , updateEIdata , updateVIdata , updateLocation};
