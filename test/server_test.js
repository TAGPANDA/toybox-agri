var test = require('tape')
var request = require('supertest')

var server = require('../server')
 
test('test route', function(t) {
  t.plan(2)

  request(server)
    .get('/status')
    .expect(200)
    .end(function(err, res) {
      t.equal(res.text, 'OK')
    })
})
