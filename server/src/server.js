require('dotenv').config()
const PORT = process.env.PORT

const http = require('http');
const { app } = require('./app');
const { processCsvData } = require('./models/planets.model');
const { mongoConnect } = require('../services/mongo');
const { loadLaunchData } = require('./models/launch.model')
// Create a server instance using the http module and the app instance
const server = http.createServer(app);


const startServer = async () => {
    // Connect to MongoDB
    await mongoConnect()
    // Process CSV data
    await processCsvData()

    await loadLaunchData()
    // Start server
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}

startServer()
