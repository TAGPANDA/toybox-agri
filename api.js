'use strict';

var pg = require('pg')
// var expressValidator = require('express-validator')

function findAgri(id, username, cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri WHERE id = $1 AND username = $2', [id, username],
      function(err, result) {
        done()
        if (err) return console.error(err)
        cb(result.rows)
      })
  })
}

exports.allAgri = function (user, cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri WHERE username = $1', [user.displayName + user.provider],
      function(err, result) {
        done()
        if (err) return console.error(err)
        cb(result.rows)
      })
  })
}

exports.list = function (req, res) {
  var username = req.user.displayName + req.user.provider
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM agri WHERE username = $1', [username],
      function(err, result) {
        done()
        if (err) return console.error(err)
        res.send(result.rows)
      })
  })
}

exports.addAgri = function (req, res) {
  var q, val

  if (!Object.keys(req.body).length) {
    q = req.query
    req.checkQuery('temp', 'Invalid temp').notEmpty().isNumeric()
    req.checkQuery('humi', 'Invalid humi').notEmpty().isNumeric()
  } else {
    q = req.body
    req.checkBody('temp', 'Invalid temp').notEmpty().isNumeric()
    req.checkBody('humi', 'Invalid humi').notEmpty().isNumeric()
  }

  var errors = req.validationErrors()

  findUser(req.user, function (result) {
    if (result.length === 0) {
      res.res.status(200).send({
        status: 'wrong user'
      })
      return
    } else if (errors) {
      res.status(400).send({
        message: 'Bad Request',
        error: errors
      })
      return
    } else {
      val = [q.temp, q.humi, req.user.displayName + req.user.provider]
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO agri("temp", "humi", "username") VALUES($1, $2, $3)', val)
        done()
        res.status(201).send({
          status: 'created successful'
        })
      })
    }
  })
}

exports.getAgri = function (req, res) {
  findUser(req.user, function (result) {
    if (result.length === 0) {
      res.res.status(200).send({
        status: 'wrong user'
      })
    } else {
      findAgri(req.params.id, req.user.displayName + req.user.provider, function(result) {
        res.status(result ? 200 : 404)
        res.send(result)
      })
    }
  })
}

exports.deleteAgri = function (req, res) {
  var val;

  findUser(req.user, function (result) {
    if (result.length === 0) {
      res.res.status(200).send({
        status: 'wrong user'
      })
    } else {
      val = [req.params.id, req.user.displayName + req.user.provider]
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('DELETE FROM agri WHERE id = $1 AND username = $2', val)
        done()
        res.status(200).send({
          status: 'created successful',
          id: req.params.id
        })
      })
    }
  })
}


var findUser = exports.findUser = function (user, cb) {
  var val = [user.displayName, user.provider]
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM users WHERE name = $1 AND oauth = $2', val,
      function(err, result) {
        done()
        if (err) return console.error(err)
        cb(result.rows)
      })
  })
}

exports.addUser = function (user, cb) {
  var val = [user.displayName, user.provider]

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO users("name", "oauth") VALUES($1, $2)', val,
      function(err, result) {
        done()
        if (err) return console.error(err)
        cb(result.rows)
      })
  })
}
