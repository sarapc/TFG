-- inici de sessió terminal
psql -U postgres -d postgres

-- codificació del plsql
SET client_encoding = 'UTF8';

-- Crear BBDD
CREATE DATABASE guia_turistica
  WITH 
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TEMPLATE = template0;

-- Connectar BBDD
\c guia_turistica

-- codificació de la base de dades
SET client_encoding = 'UTF8';

-- Per carregar els fitxers de create i inserts
\i 'RutaOnEsDesaElFitxer\CrearTaulesPostgreSQL.sql';
\i 'RutaOnEsDesaElFitxer\InsertsPostgreSQL.sql';