/**
 * Create your connection to the DB in this file
 * and remember to export it
 */

const { Pool } = require("pg");

if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured");
}

module.exports = new Pool();
