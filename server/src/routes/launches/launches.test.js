const request = require('supertest')
const { app } = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../../services/mongo')


describe('Launches API', () => {
    beforeAll(async () => await mongoConnect())
    afterAll(async () => await mongoDisconnect())
    describe('Test GET /launches', () => {
        test('it should respond with 200', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)

        })
    })

    describe('Test POST /launches', () => {
        const data = {
            mission: "to Mars",
            rocket: "tesla",
            target: "Kepler-442 b",
            launchDate: "January 17, 2027"
        }
        const dataWithoutDate = {
            mission: "to Mars",
            rocket: "tesla",
            target: "Kepler-442 b",

        }

        const launchDataWithInvalidDate = {
            mission: "to Mars",
            rocket: "tesla",
            target: "mars",
            launchDate: "LOL"
        }

        test('it should respond with 200', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)

            const requestDate = new Date(data.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)

            expect(response.body).toMatchObject(dataWithoutDate)
        })

        test('it should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(dataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'missing value property'
            })

        })

        test('it should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'not a valid date'
            })

        })
    })
})


