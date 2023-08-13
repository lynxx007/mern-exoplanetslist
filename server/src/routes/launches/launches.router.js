const express = require('express')
const { getAllLaunches, httpAddNewLaunch, deleteLaunch } = require('./launches.controller')


const launchesRouter = express.Router()

launchesRouter.get('/', getAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', deleteLaunch)

module.exports = launchesRouter
