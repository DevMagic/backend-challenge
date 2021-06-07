CREATE DATABASE TesteDevMagic;

\c TesteDevMagic

CREATE TABLE summoner
(
  id bigserial NOT NULL PRIMARY KEY,
  Nickname character varying(100),
  AccountId character varying(100),
  SummonerId character varying(100),
  SummonerLevel integer NOT NULL,
  ProfileIconId integer NOT NULL
);