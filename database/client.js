const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DBNAME || "postgres",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
});

async function ensureSchema() {
  // Simple users table — id, name, email(unique), password_hash, created_at
  const create = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
  await pool.query(create);
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  ensureSchema,
  pool,
};
