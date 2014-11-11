'use strict';

var pg = require('pg')


function get(id, cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri WHERE id = $1', [id], function(err, result) {
      done()
      if(err) return console.error(err)
      cb(result.rows)
    })
  })
}

var all = exports.all = function (cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri', function(err, result) {
      done()
      if(err) return console.error(err)
      cb(result.rows)
    })
  })
}

exports.list = function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri', function(err, result) {
      done()
      if(err) return console.error(err)
      res.send(result.rows)
    })
  })
}

exports.add = function (req, res) {
  var q
  if (!Object.keys(req.body).length) q = req.query
  else q = req.body

  if (!q.temp || !q.humi) return res.status(400).send({ error: 'Bad Request' })

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO agri("temp", "humi") VALUES($1, $2)', [q.temp, q.humi])
    done()
    res.status(201).send({
      status: 'created successful'
    })
  })
}

exports.get = function (req, res) {
  get(req.params.id, function(result) {
    res.status(result ? 200 : 404)
    res.send(result)
  })
}

exports.delete = function (req, res) {
  var self = this
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('DELETE FROM agri WHERE id = $1', [req.params.id])
    done()
    res.status(200).send({
      status: 'created successful',
      id: req.params.id
    })
  })
}
