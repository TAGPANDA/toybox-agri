# toybox-agri

This is a toybox.

[![wercker status](https://app.wercker.com/status/f3a59d789a5e0bb61a0a508a77f2beb8/s "wercker status")](https://app.wercker.com/project/bykey/f3a59d789a5e0bb61a0a508a77f2beb8)

[![Dependency Status](https://david-dm.org/tagpanda/toybox-agri.svg)](https://david-dm.org/tagpanda/toybox-agri)
[![devDependency Status](https://david-dm.org/tagpanda/toybox-agri/dev-status.svg)](https://david-dm.org/tagpanda/toybox-agri#info=devDependencies)

## heroku

```
$ heroku addons:add heroku-postgresql:dev
$ heroku addons:docs heroku-postgresql
$ heroku pg:wait
$ heroku config | grep HEROKU_POSTGRESQL
$ heroku pg:promote HEROKU_POSTGRESQL_XXX_URL
$ heroku config:add APP_URL=???
$ heroku config:add TWITTER_CONSUMER_KEY=???
$ heroku config:add TWITTER_CONSUMER_SECRET=???
$ heroku config:add FACEBOOK_APP_ID=???
$ heroku config:add FACEBOOK_APP_SECRET=???
```

## db setup

connect heroku PostgreSQL DB

```
$ heroku pg:psql
```

```sql
create table agri(
  id serial,
  temp varchar,
  humi varchar,
  username varchar,
  name varchar,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

create table users(
  id serial,
  oauth varchar,
  name varchar,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## db local(mac)

```
$ initdb /usr/local/var/postgres -E utf8
$ pg_ctl -D /usr/local/var/postgres start
$ heroku pg:pull HEROKU_POSTGRESQL_XXX_URL localagri --app APPNAME
$ psql localagri
```

## Local Usage

```
$ export $APP_URL=???
$ export DATABASE_URL=tcp://localhost:5432/localagri
$ export TWITTER_CONSUMER_KEY=???
$ export TWITTER_CONSUMER_SECRET=???
$ export FACEBOOK_APP_ID=???
$ export FACEBOOK_APP_SECRET=???
$ pg_ctl -D /usr/local/var/postgres start
$ foreman start
```

```
$ npm run watch
```

## Author
[TAG PANDA, Inc.](http://www.tagpanda.co.jp/)
