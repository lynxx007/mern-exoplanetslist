const { parse } = require('csv-parse')

const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo')
const habitablePlanets = []

// This function takes a planet object as input and returns a boolean value.
const isHabitablePlanets = planet => {
    // Check if the planet's disposition is confirmed.
    return planet['koi_disposition'] === 'CONFIRMED'
        // Check if the planet's insolation flux is within the habitable range.
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        // Check if the planet's radius is less than 1.6 Earth radii.
        && planet['koi_prad'] < 1.6;
}

const processCsvData = async () => {
    // Define the path to the CSV file
    const csvPath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    try {
        // Create a read stream for the CSV file
        const stream = fs.createReadStream(csvPath)
        // Create a parser for the CSV file
        const parser = parse({
            // Ignore lines starting with #
            comment: '#',
            // Treat the first line as column headers
            columns: true
        })

        // Pipe the read stream to the parser
        stream.pipe(parser)

        // Iterate over each row in the CSV file
        for await (const data of parser) {
            try {
                // Check if the planet is habitable
                if (isHabitablePlanets(data)) {
                    // Save the planet to the database
                    await savePlanet(data)
                }
            } catch (error) {
                console.error(error);
            }
        }
        // Close the read stream and end the parser
        stream.close()
        parser.end()
        // Get the total number of planets found in the database
        const countFoundPlanet = (await getAllPlanetsModel()).length
        console.log(`${countFoundPlanet} planets found`);
    } catch (error) {
        console.log(error);
    }

}

// This is an asynchronous function that saves a planet to the database
const savePlanet = async (planet) => {
    try {
        // Update or insert a planet in the database based on its keplerName
        await planets.updateOne({
            keplerName: planet.keplerName
        }, {
            keplerName: planet.keplerName
        }, {
            upsert: true
        })
    } catch (error) {
        // If there is an error, log it to the console
        console.error(error);
    }
}


// Define an asynchronous function named getAllPlanetsModel
const getAllPlanetsModel = async () => {
    // Use the find method to retrieve all documents from the planets collection in the database
    // Exclude the __id and __v fields from the returned documents
    return await planets.find({}, {
        '__id': 0, '__v': 0
    })
}


module.exports = {
    processCsvData,
    getAllPlanetsModel
}