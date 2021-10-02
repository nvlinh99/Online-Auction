/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const superTest = require('supertest')

const configuration = require('../configuration')

const hostServer = configuration.server.host
const server = superTest.agent(hostServer)

describe('Sample test', function () {
  it('should return home page - test content type', function (done) {
    server.get('/')
      .expect('Content-type', /text/)
      .end(function (err, res) {
        done()
      })
  })

  it('should return home page - test status', function (done) {
    server.get('/')
      .expect(200)
      .end(function (err, res) {
        done()
      })
  })
})
