'use strict';

var path = require('path')
var fs = require('fs')

var express = require('express')
var morgan = require('morgan')
var session = require('express-session')
var helmet = require('helmet')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var compress = require('compression')
var serveStatic = require('serve-static')
var Handlebars = require('handlebars')
require('node-jsx').install({extension:'.jsx'})

var api = require('./api')

var port = process.env.PORT || 5000

var app = module.exports = express()

var apiUrl = process.env.APP_URL || 'http://localhost:5000/'

var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: apiUrl + 'auth/twitter/callback'
  }, function (token, tokenSecret, profile, done) {
    profile.twitter_token = token
    profile.twitter_token_secret = tokenSecret
    process.nextTick(function () {
      return done(null, profile)
    })
  }
))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    authorizationURL: 'https://www.facebook.com/v2.0/dialog/oauth',
    callbackURL: apiUrl + 'auth/facebook/callback'
  }, function (token, refreshToken, profile, done) {
    profile.facebook_token = token
    profile.facebook_refresh_token = refreshToken
    process.nextTick(function () {
      return done(null, profile)
    })
  }
))

if (process.env.NODE_ENV === 'production') apiUrl = process.env.APP_URL

var fixPath = function (pathString) {
  return path.resolve(path.normalize(pathString))
}

app.use(compress())
app.use(morgan('combined'))
app.use(serveStatic(fixPath('public'), { maxAge: 86400000 }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet.xssFilter())
app.use(helmet.nosniff())
app.use(session({
  secret: 'keyboard cat2',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(expressValidator({
 customValidators: {
    isNumeric: function (value) {
      return !isNaN(parseFloat(value)) && isFinite(value)
    }
  }
}))

// Template
Handlebars.registerPartial(
  'header',
  fs.readFileSync(__dirname + '/views/partials/header.hbs', 'utf8'))

Handlebars.registerPartial(
  'footer',
  fs.readFileSync(__dirname + '/views/partials/footer.hbs', 'utf8'))

Handlebars.registerPartial(
  'copyright',
  fs.readFileSync(__dirname + '/views/partials/copyright.hbs', 'utf8'))

Handlebars.registerHelper('variable', function (name, val) {
  return new Handlebars.SafeString('var ' + name + '=' + val)
})

var sourceIndex = fs.readFileSync(__dirname + '/views/index.hbs', 'utf8')
var sourceLogin = fs.readFileSync(__dirname + '/views/login.hbs', 'utf8')

// API
app.get('/api/agri/list', api.list)
app.get('/api/agri/get/:id', api.getAgri)
app.get('/api/agri/delete/:id', api.deleteAgri)
app.post('/api/agri/create', api.addAgri)
app.get('/api/agri/create', api.addAgri)
app.get('/api/agri/all', function (req, res) {
  var hour = 3600000

  res.setHeader('Cache-Control', 'public, max-age=' + hour)
  res.setHeader('Expires', new Date(Date.now() + hour).toString())

  api.allAgri(req.user, function (list) {
    res.send(list)
  })
})

app.get('/auth/twitter',
  passport.authenticate('twitter'))

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
  })

app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
  })

app.get('/login', function (req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.send(Handlebars.compile(sourceLogin)({
    title: 'Toybox Agri'
  }).replace(/[\n\t]/g, ''))
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})


function renderIndex(req, res) {
  res.setHeader('Content-Type', 'text/html')

  var template = Handlebars.compile(sourceIndex)
  var photo

  if (req.user.photos) {
    photo = req.user.photos[0].value
  } else if (req.user.provider === 'facebook') {
    photo = 'https://graph.facebook.com/' + req.user.id + '/picture?type=small'
  }

  api.allAgri(req.user, function () {
    res.send(template({
      title: 'Toybox Agri',
      location: apiUrl,
      user: JSON.stringify({
        name: req.user.displayName,
        img: photo
      })
    }).replace(/[\n\t]/g, ''))
  })
}

// toppage
app.get('/', ensureAuthenticated, function (req, res) {
  api.findUser(req.user, function (result) {
    if (result.length === 0) {
      api.addUser(req.user, function () {
        renderIndex(req, res)
      })
    } else {
      renderIndex(req, res)
    }
  })
})

// health check
app.get('/status', function (req, res) {
  res.sendStatus(200)
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port)
}

if (process.env.NODE_ENV !== 'production') {
  console.log('Toybox Agri is running at: ', apiUrl)
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next()

  res.redirect('/login')
}
