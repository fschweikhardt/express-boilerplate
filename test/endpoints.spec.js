const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeTestDataArray } = require('./testEndpoint.fixtures')

describe('testEndpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE testTable RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE testTable RESTART IDENTITY CASCADE'))

//1 DESCRIBE - get endpoint
  describe(' 1 GET /api/testEndpoint', () => {
//1A - CONTEXT to endpoint - given no data in the db
        context('1A Given no testData', () => {
          it('responds with 200 and an empty list', () => {
            return supertest(app)
              .get('/api/testEndpoint')
              .expect(200, [])
      })
    })
//1B - CONTEXT to people endpoint - given there are people in the db
    context('1B Given there is testData in the database', () => {
      const DataTest = makeTestDataArray()
      beforeEach('insert testData', () => {
        return db
          .into('testTable')
          .insert(DataTest)
          .then(() => {
            return db
          })
      })

      it('responds with 200 and all of the testData', () => {
        return supertest(app)
        .get('/api/testEndpoint')
        .expect(200, DataTest)
      })
    })
  })

//2 DESCRIBE - testData by id    
describe(` 2 GET /api/data/:data_id`, () => {
  //2A CONTEXT - to person by id - given no person id in db
      context(`2A Given no data`, () => {
        it(`responds with 404`, () => {
          const data_id = 123456
          return supertest(app)
            .get(`/api/data/${data_id}`)
            .expect(404, { error: { message: `${data_id} not found` } })
         })
      })
//2B CONTEXT - to data by id - given there is the data by id in db
  context('2B Given there is data in the database', () => {
    const DataTest = makeTestDataArray()

    beforeEach('insert data', () => {
      return db
        .into('table')
        .insert(DataTest)
        .then(() => {
          return db
        })
      })
      
    it('responds with 200 and the specified datat', () => {
      const dataId = 2
      const expectedData = testDataTest[dataId - 1]
      return supertest(app)
        .get(`/api/people/${dataId}`)
        .expect(200, expectedData)
      })
    })
  })
//3 DESCRIBE - POST person by id  
  describe(` 3 POST /api/people`, () => {

    it(`creates a new obj, responding with 201 and the new obj`,  function() {
      this.retries(3)
      const newPerson = {
        test_name: 'New Person FN',
        date: new Date('2000-01-31').toISOString()
      }
    return supertest(app)
      .post('/api/test')
      .send(newPerson)
      .expect(201)
      .expect(res => {
        expect(res.body.test_name).to.eql(newPerson.test_name)
        expect(res.body.date).to.eql(newPerson.date)
        expect(res.body).to.have.property('id')
        expect(res.headers.location).to.eql(`/api/test/${res.body.id}`)
      })
      .then(postRes =>
        supertest(app)
        .get(`/api/test/${postRes.body.id}`)
        .expect(postRes.body)
      )
    })

    const requiredFields = ['test_name', 'date']

    requiredFields.forEach(field => {
    const newPerson = {
      test_name: 'New Person FN',
      date: new Date('2000-01-31')
    }

    it(`responds with 400 and an error message when the '${field}' is missing`, () => {
      delete newPerson[field]

      return supertest(app)
        .post('/api/test')
        .send(newPerson)
        .expect(400, {
          error: { message: `Missing '${field}' in request body` }
        })
      })
    })
  })
//4 DESCRIBE - DELETE date by id  
  describe(`4 DELETE /api/test/:data_id`, () => {
    //4A CONTEXT - given there is no data by id to delete
    context(`4A Given no data`, () => {
      it(`responds with 404`, () => {
        const data_Id = 123456
        return supertest(app)
          .delete(`/api/data/${data_Id}`)
          .expect(404, { error: { message: `data not found` } })
        })
      })
    //4B CONTEXT - given there are people by id to delete
    context('4B Given there is data in the database', () => {
      const testDataTest = makeTestDataArray()
  
      beforeEach('insert data', () => {
        return db
          .into('table')
          .insert(testDataTest)
          .then(() => {
            return db
          })
        })
      
        it('responds with 204 and removes the data', () => {
          const idToRemove = 2
          const expectedData = testData.filter(data => data.id !== idToRemove)
          return supertest(app)
            .delete(`/api/test/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/test`)
                .expect(expectedPeople)
            )
        })
      })
    })
  //5 DESCRIBE - PATCH data by id 
  describe(`5 PATCH /api/test/:data_id`, () => {
    //5A CONTEXT given there is no by id
    context(`5A Given no data`, () => {
      it(`responds with 404`, () => {
        const dataId = 123456
        return supertest(app)
          .patch(`/api/test/${testId}`)
          .expect(404, { error: { message: `data not found` } })
      })
    })
    //5B CONTEXT given there is datta in the database
    context('5B Given there are people in the database', () => {
      const testDataTest = makeTestDataArray()
        
      beforeEach('insert data', () => {
        return db
          .into('table')
          .insert(testDataTest)
          .then (() => {
            return db
          })
      })
        
      it('responds with 204 and updates the data', () => {
        const idToUpdate = 2
        const updateData = {
          test_name: 'updated person name',
          data: new Date('1975-09-25').toISOString()
        }
        const expectedPerson = {
          ...testDataTest[idToUpdate - 1],
          ...updateData
        }
        return supertest(app)
          .patch(`/api/test/${idToUpdate}`)
          .send(updateData)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/test/${idToUpdate}`)
              .expect(expectedData)
            )
        })
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/test/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either 'test_name' or 'date'.`
            }
          })
      })
      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateData = {
          test_name: 'updated first name',
        }
        const expectedPerson = {
          ...testDataTest[idToUpdate - 1],
          ...updateData
        }
  
        return supertest(app)
          .patch(`/api/people/${idToUpdate}`)
          .send({
            ...updateData,
              fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/test/${idToUpdate}`)
              .expect(expectedData)
        )
      })
    })
  })
})