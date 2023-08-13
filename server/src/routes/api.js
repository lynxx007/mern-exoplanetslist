const express = require('express')
// Importing required modules
const planetsRouter = require('./planets/planets.router')
const launchesRouter = require('./launches/launches.router')


const api = express.Router()



// Routing requests to /planets to planetsRouter
api.use('/planets', planetsRouter)

// Routing requests to /launches to launchesRouter
api.use('/launches', launchesRouter)

module.exports = {
    api
}