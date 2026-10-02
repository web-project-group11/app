CREATE DATABASE appdb_test;

\connect appdb_test

\ir /docker-entrypoint-initdb.d/init.sql