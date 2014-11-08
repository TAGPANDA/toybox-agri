var path = require('path')
var fs = require('fs')

var express = require('express')
var helmet = require('helmet')
var bodyParser = require('body-parser')
var compress = require('compression')
var serveStatic = require('serve-static')
var pg = require('pg')
var hbs = require('hbs')

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

hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

// API
app.get('/api/agri/list', api.list)
app.get('/api/agri/get/:id', api.get)
app.get('/api/agri/delete/:id', api.delete)
app.post('/api/agri/create', api.add)
app.get('/api/agri/create', api.add)

app.get('/', function(req, res) {
  api.all(function(list) {
    res.locals = {
      title: 'Toybox Agri',
      location: apiUrl,
      list: list
    }

    res.render('index')
  });
})

// health check
app.get('/status', function(req, res) {
  res.sendStatus(200)
})

if (!module.parent) {
  app.listen(port);
}

if (process.env.NODE_ENV !== 'production') {
  console.log('playground-agri is running at: http://localhost:' + port)
}
