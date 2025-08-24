import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

// Parse CLEARDB_DATABASE_URL if available (Heroku ClearDB format)
let connectionConfig;
if (process.env.CLEARDB_DATABASE_URL) {
  const url = new URL(process.env.CLEARDB_DATABASE_URL);
  connectionConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading slash
    port: parseInt(url.port) || 3306,
  };
} else {
  connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const db = knex({
  client: "mysql2",
  connection: connectionConfig,
});

export default db;
