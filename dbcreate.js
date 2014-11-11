var pg = require('pg')


var client = new pg.Client(process.env.DATABASE_URL)

var query = 'create table agri( id serial, temp varchar, humi varchar, created_at TIMESTAMP NOT NULL DEFAULT now())'

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err)
  }

  client.query(query, function(err, result) {
    if(err) {
      console.error('error running query', err)
      client.end()
    }

    client.end()
  })
})
