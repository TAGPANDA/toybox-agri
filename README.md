# playground-agri

## heroku

```
$ heroku addons:add heroku-postgresql:dev
$ heroku addons:docs heroku-postgresql
$ heroku pg:wait
$ heroku config | grep HEROKU_POSTGRESQL
$ heroku pg:promote HEROKU_POSTGRESQL_CHARCOAL_URL
```

```
heroku pg:psql

dsbqcnqudpb3h=> create table agri(
dsbqcnqudpb3h(> id serial,
dsbqcnqudpb3h(> temp varchar,
dsbqcnqudpb3h(> humi varchar,
dsbqcnqudpb3h(> created_at TIMESTAMP NOT NULL DEFAULT now());

insert into "agri" (temp, humi) values ('20', '50');

dsbqcnqudpb3h=> select * from agri
dsbqcnqudpb3h-> ;
 id | temp | humi
----+------+------
  1 | 20   | 50
(1 row)
```

```
$ initdb /usr/local/var/postgres -E utf8
$ pg_ctl -D /usr/local/var/postgres start
$ heroku pg:pull HEROKU_POSTGRESQL_XXX_URL mylocaldb --app APPNAME
```


```
$ export DATABASE_URL=tcp://localhost:5432/mylocaldb
$ npm start
```
