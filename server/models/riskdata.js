const mongoose = require('mongoose');

const utcDataSchema = new mongoose.Schema({
    Latitude: {
        type: Number,
        required: true
    },
    Longitude: {
        type: Number,
        required: true
    },
    UTCI: {
        type: Map,
        of: Number,
        required: true
    }
});

// Correct export
const UTCIData = mongoose.model('UTCIData', utcDataSchema, 'HAZARDINDEX');
module.exports = UTCIData;
