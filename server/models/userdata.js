const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  vidata: {
    type: Number,
    required: true,
    unique: true, // Assuming it's a unique identifier
  },
  eidata: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  }
});

// Export the model
const UserData = mongoose.model('UserData', UserSchema);
module.exports = UserData;
