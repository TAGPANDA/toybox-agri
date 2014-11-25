'use strict';

var pg = require('pg')


var client = new pg.Client(process.env.DATABASE_URL)

var agri = 'create table agri( id serial, temp varchar, humi varchar, username varchar, name varchar, created_at TIMESTAMP NOT NULL DEFAULT now())'
var users = 'create table users( id serial, oauth varchar, name varchar, created_at TIMESTAMP NOT NULL DEFAULT now())'

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err)
  }

  client.query(agri, function(err) {
    if(err) {
      console.error('error running query', err)
      client.end()
    }

    client.end()
  })

  client.query(users, function(err) {
    if(err) {
      console.error('error running query', err)
      client.end()
    }

    client.end()
  })
})
