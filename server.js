'use strict';

var path = require('path')
var fs = require('fs')

var express = require('express')
var helmet = require('helmet')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var compress = require('compression')
var serveStatic = require('serve-static')
var pg = require('pg')
var Handlebars = require('handlebars')
require('node-jsx').install({extension:'.jsx'})
var React = require('react')

var Agri = require('./dev/view.jsx')
var api = require('./api')

var port = process.env.PORT || 3000

var app = module.exports = express()

var apiUrl = 'http://localhost:3000/'

if (process.env.NODE_ENV === 'production') apiUrl = process.env.APP_URL

var fixPath = function (pathString) {
  return path.resolve(path.normalize(pathString))
}

app.use(compress())
app.use(serveStatic(fixPath('public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet.xssFilter())
app.use(helmet.nosniff())
app.use(expressValidator({
 customValidators: {
    isNumeric: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
  }
}));

// Template
Handlebars.registerPartial(
  'header',
  fs.readFileSync(__dirname + '/views/partials/header.hbs', 'utf8'))

Handlebars.registerPartial(
  'copyright',
  fs.readFileSync(__dirname + '/views/partials/copyright.hbs', 'utf8'))

var sourceIndex = fs.readFileSync(__dirname + '/views/index.hbs', 'utf8')

// API
app.get('/api/agri/list', api.list)
app.get('/api/agri/get/:id', api.get)
app.get('/api/agri/delete/:id', api.delete)
app.post('/api/agri/create', api.add)
app.get('/api/agri/create', api.add)
app.get('/api/agri/all', function(req, res) {
  api.all(function(list) {
    res.send(list)
  })
})

// toppage
app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html')

  api.all(function(list) {
    Handlebars.registerPartial(
      'content', 
      React.renderToStaticMarkup(React.createElement(Agri, {list: list})))

    var template = Handlebars.compile(sourceIndex)

    res.send(template({
      title: 'Toybox Agri',
      location: apiUrl
    }))
  })
})

// health check
app.get('/status', function(req, res) {
  res.sendStatus(200)
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port)
}

if (process.env.NODE_ENV !== 'production') {
  console.log('Toybox Agri is running at: http://localhost:' + port)
}
