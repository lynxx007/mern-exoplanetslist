const axios = require('axios')
const launchesDatabase = require('./launch.mongo')
const planets = require('./planets.mongo')
const launches = new Map()
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
const DEFAULT_FLIGHT_NUMBER = 100
// const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('2023-06-19'),
//     target: 'Kepler-442 b',
//     customers: ['Luthfi Rizky'],
//     upcoming: true,
//     success: true
// }

// let latestFlightNumber = launch.flightNumber

// launches.set(launch.flightNumber, launch)

const populateLaunch = async () => {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })
    if (response.status !== 200) {
        throw new Error('Failed Fetching data from SpaceX API')
    }

    const launchDocs = response.data.docs
    for await (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }
        console.log(`${launch.rocket},${launch.mission}`);
        await saveLaunch(launch)
    }
}

const findLaunch = async (filter) => {
    return await launchesDatabase.findOne(filter)
}
const loadLaunchData = async () => {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if (firstLaunch) {
        console.log('first launch has been loaded');

    } else {
        await populateLaunch()
    }


}

const saveLaunch = async launch => {

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}


const scheduleNewLaunch = async launch => {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('planet does not exist')
    }
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Luthfi'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}


// const addNewLaunch = launch => {
//     latestFlightNumber++
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         flightNumber: latestFlightNumber,
//         customers: ['Luthfi Rizky', 'NASA'],
//         upcoming: true,
//         success: true
//     }))
// }


const getLatestFlightNumber = async () => {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}


const getAllLaunchesModel = async (skip, limit) => {
    return await launchesDatabase.find({}, {
        '__id': 0, '__v': 0
    })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}


const existLaunchId = async (id) => {
    return await findLaunch({
        flightNumber: id
    })

    // return launches.has(id)
}
const abortLaunchById = async id => {
    const aborted = await launchesDatabase.findOneAndUpdate({
        flightNumber: id
    }, {
        upcoming: false, success: false
    })
    return aborted.modifiedCount === 1;

    // const aborted = launches.get(id)
    // aborted.upcoming = false
    // aborted.success = false
    // return aborted
}

module.exports = {
    getAllLaunchesModel,
    scheduleNewLaunch,
    existLaunchId,
    abortLaunchById,
    loadLaunchData
}