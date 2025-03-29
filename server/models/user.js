const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// **Vulnerability Index Data Schema**
const VISchema = new mongoose.Schema({
  dob: { type: String, default: "" },
  age: { type: String, default: "" },
  weight: { type: String, default: "" },
  weightUnit: { type: String, default: "kg" },
  height: { type: String, default: "" },
  heightUnit: { type: String, default: "m" },
  heightInches: { type: String, default: "" },
  income: { type: String, default: "" },
  adults: { type: String, default: "" },
  educationLevel: { type: String, default: "" },
  enrolled: { type: String, default: "" },
  gender: { type: String, default: "" },
  pregnant: { type: String, default: "" },
  chronicIssues: { type: String, default: "" },
  hospitalization: { type: String, default: "" },
  medication: { type: String, default: "" },
  disability: { type: String, default: "" },
  benchmarkDisability: { type: String, default: "" },
});

const EISchema = new mongoose.Schema({
  workplace: { type: String, default: "" },
  heavy_machinery: { type: String, default: "" },
  indoor_structure: { type: String, default: "" },
  services: { type: String, default: "" },
  residence: { type: String, default: "" },
  structure: { type: String, default: "" },
  home_services: { type: String, default: "" },
  transport_type: { type: String, default: "" },
  alcohol: { type: String, default: "" },
  daily_consumption: { type: String, default: "" },
  quarterly_frequency: { type: String, default: "" },
  tobaccoConsumed: { type: String, default: "" },
  tobaccoType: { type: String, default: "" },
  tobaccoAmount: { type: String, default: "" },
  recentTobacco: { type: String, default: "" },
  smokelessTobacco: { type: String, default: "" },
  smokedTobacco: { type: String, default: "" },
  caffeine: { type: String, default: "" },
  sleep: { type: String, default: "" },
  fluidIntake: { type: String, default: "" },
  activityStatus: { type: String, default: "" },
  air_quality: { type: String, default: "" },
  hospital_access: { type: String, default: "" },
});



// **Schedule Schema (Updated)**
const ScheduleSchema = new mongoose.Schema({
  home: {
    hrs: [{ type: Number }], // Set of home hours
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }, // [longitude, latitude]
  },
  work: {
    hrs: [{ type: Number }], // Set of work hours
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }, // [longitude, latitude]
  },
  useCustom: { type: Boolean, default: false }, // Keep useCustom flag
});

// **Main User Schema**
const UserSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  UserName: { type: String, trim: true, default: "" },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  NOTE: { type: String, trim: true, default: "" },
  profilepic: {
    type: String,
    trim: true,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu6bBHwMFwvad_dCadhshd30nFTgtSqYtcgA&s",
  },
  VIdata: { type: VISchema, default: {} },
  EIdata: { type: EISchema, default: {} },
  schedule: { type: ScheduleSchema, default: () => ({}) },
});

// **Hash Password Before Saving**
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// **Compare Password Method**
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// **Export Model**
const UserData = mongoose.model("User", UserSchema);
module.exports = UserData;
