# toybox-agri

## heroku

```
$ heroku addons:add heroku-postgresql:dev
$ heroku addons:docs heroku-postgresql
$ heroku pg:wait
$ heroku config | grep HEROKU_POSTGRESQL
$ heroku pg:promote HEROKU_POSTGRESQL_CHARCOAL_URL
```

## db setup

connect heroku PostgreSQL DB

```
heroku pg:psql
```

```sql
dsbqcnqudpb3h=> create table agri(
dsbqcnqudpb3h(> id serial,
dsbqcnqudpb3h(> temp varchar,
dsbqcnqudpb3h(> humi varchar,
dsbqcnqudpb3h(> created_at TIMESTAMP NOT NULL DEFAULT now());
```

### query example

```sql
dsbqcnqudpb3h=> insert into "agri" (temp, humi) values ('20', '50');
dsbqcnqudpb3h=> select * from agri;
 id | temp | humi |         created_at
----+------+------+----------------------------
  1 | 20   | 50   | 2014-11-08 09:29:55.20633
```

## db local

```
$ initdb /usr/local/var/postgres -E utf8
$ pg_ctl -D /usr/local/var/postgres start
$ heroku pg:pull HEROKU_POSTGRESQL_XXX_URL localagri --app APPNAME
```

## Local Usage

```
$ export DATABASE_URL=tcp://localhost:5432/localagri
$ foreman start
```

## Author
TAG PANDA inc.
