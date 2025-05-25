// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.68.120',
  database: 'guia_turistica',
  password: 'saretta04',
  port: 5432,
  client_encoding: 'utf8',
});

module.exports = pool;