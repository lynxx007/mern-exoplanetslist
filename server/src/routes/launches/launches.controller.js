const { getPagination } = require('../../../services/query')
const { getAllLaunchesModel, scheduleNewLaunch, existLaunchId, abortLaunchById } = require('../../models/launch.model')

const getAllLaunches = async (req, res) => {
    const { skip, limit } = getPagination(req.query)
    const launches = await getAllLaunchesModel(skip, limit)
    return res.status(200).json(launches)
}

const httpAddNewLaunch = async (req, res) => {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'missing value property'
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "not a valid date"
        })
    }

    await scheduleNewLaunch(launch)
    return res.status(200).json(launch)
}


const deleteLaunch = async (req, res) => {
    const launchId = Number(req.params.id)

    const existedLaunchId = await existLaunchId(launchId)
    if (!existedLaunchId) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = await abortLaunchById(launchId)
    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted"
        })
    }
    return res.status(201).json({
        ok: true
    })
}

module.exports = {
    getAllLaunches,
    httpAddNewLaunch,
    deleteLaunch
}