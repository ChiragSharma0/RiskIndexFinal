const mongoose = require("mongoose");

const geoUTCISchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  UTCI: {
    type: Map,
    of: Number,
    required: true,
  }
});

geoUTCISchema.index({ location: "2dsphere" });

module.exports = mongoose.model("GeoUTCIData", geoUTCISchema, "HAZARDINDEX");
