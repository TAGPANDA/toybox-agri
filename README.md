# toybox-agri

[![wercker status](https://app.wercker.com/status/f3a59d789a5e0bb61a0a508a77f2beb8/s "wercker status")](https://app.wercker.com/project/bykey/f3a59d789a5e0bb61a0a508a77f2beb8)

## heroku

```
$ heroku addons:add heroku-postgresql:dev
$ heroku addons:docs heroku-postgresql
$ heroku pg:wait
$ heroku config | grep HEROKU_POSTGRESQL
$ heroku pg:promote HEROKU_POSTGRESQL_XXX_URL
```

## db setup

connect heroku PostgreSQL DB

```
heroku pg:psql
```

```sql
create table agri(
  id serial,
  temp varchar,
  humi varchar,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

### query example

```sql
insert into "agri" (temp, humi) values ('20', '50');
select * from agri;
 id | temp | humi |         created_at
----+------+------+----------------------------
  1 | 20   | 50   | 2014-11-08 09:29:55.20633
```

## db local

```
$ initdb /usr/local/var/postgres -E utf8
$ pg_ctl -D /usr/local/var/postgres start
$ heroku pg:pull HEROKU_POSTGRESQL_XXX_URL localagri --app APPNAME
$ psql localagri
```

## Local Usage

```
$ export DATABASE_URL=tcp://localhost:5432/localagri
$ exprt TWITTER_CONSUMER_KEY=???
$ exprt TWITTER_CONSUMER_SECRET=???
$ pg_ctl -D /usr/local/var/postgres start
$ foreman start
```

```
$ npm run watch
```

## Author
TAG PANDA inc.
