// knexfile.cjs
const pkg = require('knex');
require('dotenv').config();

const postgres = require('postgres');
const connectionStr = process.env.DATABASE_URL;

const knex = pkg;

module.exports = {
  development: {
    client: 'pg',
    connection: connectionStr,
    migrations: {
      directory: '../db/migrations'
    }   
  }
};//IvdVHkWRju41lJ5r