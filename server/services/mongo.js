const mongoose = require('mongoose')
require('dotenv').config() // load.env file from the root of the app into process.env variables (MongoDB connection strings)
const MONGO_URL = process.env.DB_URL

const mongoConnect = async () => {
    await mongoose.connect(MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.log('Error connecting to MongoDB', error))
}

const mongoDisconnect = async () => {
    await mongoose.disconnect()
}

module.exports = { mongoConnect, mongoDisconnect }