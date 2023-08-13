const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const { api } = require('./routes/api')
const helmet = require('helmet')
const app = express()

app.use(helmet())
// Allowing cross-origin resource sharing for requests from http://localhost:3000
app.use(cors({
    origin: "http://localhost:3000"
}))

// Logging HTTP requests and responses
app.use(morgan('combined'))

// Parsing incoming JSON data
app.use(express.json())

// Mounts the API router under the '/v1' path
app.use('/v1', api);

// Serving static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')))



// Catch-all route to serve index.html for any other requests
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = {
    app
}