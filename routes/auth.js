var express = require("express");
var router = express.Router();
const authService = require("../services/authService");
const db = require("../database/client");

// Ensure DB schema is present
db.ensureSchema().catch((err) => {
  console.error("Failed to ensure DB schema:", err);
});

router.post("/login", async function (req, res, next) {
  try {
    console.log("/auth/login|req.body]:", req.body);
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    return res.json({ user });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async function (req, res, next) {
  try {
    console.log("/auth/signup|req.body]:", req.body);
    const { name, email, password } = req.body;
    const user = await authService.signup(name, email, password);
    return res.status(201).json({ user });
  } catch (err) {
    console.error("Signup error", err);
    if (err.code === "EMAIL_EXISTS")
      return res.status(409).json({ error: "Email already in use" });
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
