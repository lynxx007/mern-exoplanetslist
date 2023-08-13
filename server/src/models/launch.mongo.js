// Importing mongoose library
const mongoose = require('mongoose')

// Creating a new mongoose schema for Launch
const launchSchema = new mongoose.Schema({
    // Flight number of the launch
    flightNumber: {
        type: Number,
        required: true
    },
    // Date of the launch
    launchDate: {
        type: Date,
        required: true
    },
    // Mission name of the launch
    mission: {
        type: String,
        required: true
    },
    // Rocket name of the launch
    rocket: {
        type: String,
        required: true
    },
    // List of customers for the launch
    customers: [String],
    // Boolean value indicating if the launch is upcoming or not
    upcoming: {
        type: Boolean,
        required: true
    },
    // Boolean value indicating if the launch was successful or not
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    target: {
        type: String,
    }

})

// Exporting the Launch model
module.exports = mongoose.model('Launch', launchSchema)