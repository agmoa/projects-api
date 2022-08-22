const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
	port: process.env.DB_PORT,

	/* ======= PRODUCTION ======= */
	user: process.env.DB_USER || process.env.DB_USER_1,
	host: process.env.DB_HOST || `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME_1}`,
	database: process.env.DB || process.env.DB_NAME_1,
	password: process.env.DB_PASS || process.env.DB_PASS_1,
});

module.exports = db;
