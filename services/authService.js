const db = require("../database/client");
const bcrypt = require("bcryptjs");

async function login(email, password) {
  if (!email || !password) {
    const e = new Error("Invalid Input");
    e.code = "23504";
    throw e;
  }
  // Find user by email
  const res = await db.query(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
    [email]
  );
  const row = res.rows[0];
  if (!row) return null;

  const match = await bcrypt.compare(password, row.password_hash);
  if (!match) return null;

  // Do not return password_hash
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

async function signup(name, email, password) {
  if (!name || !email || !password) {
    const e = new Error("Invalid Input");
    e.code = "23504";
    throw e;
  }
  // Expect a plain password (or hashed externally). We'll assume plain and hash here.
  const passwordHash = await bcrypt.hash(password, 10);

  const insert = `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`;
  try {
    const res = await db.query(insert, [name, email, passwordHash]);
    return res.rows[0];
  } catch (err) {
    // Unique violation on email
    if (err.code === "23505") {
      const e = new Error("Email already in use");
      e.code = "EMAIL_EXISTS";
      throw e;
    }
    throw err;
  }
}

module.exports = { login, signup };
