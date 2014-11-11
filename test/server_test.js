var assert = require('power-assert')
var request = require('supertest')

process.env.NODE_ENV = 'test'

var app = require('../server')


describe('GET /status', function() {
  it('get status 200', function(done) {
    request(app)
      .get('/status')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)

        assert.equal(res.text, 'OK')
        done()
      })
  })
})

describe('GET /', function() {
  it('get index html', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)

        assert.equal(res.text.substr(0, 15), '<!doctype html>')
        done()
      })
  })
})

describe('GET /api/agri/list', function() {
  it('get json list', function(done) {
    request(app)
      .get('/api/agri/list')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err)

        assert(res.body)
        done()
      })
  })
})
