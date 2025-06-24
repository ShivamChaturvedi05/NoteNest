import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";

dotenv.config();
const app = express();
const port = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: "SECRET",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Passport Strategy for login
passport.use(new Strategy(async (username, password, cb) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
  if (result.rows.length === 0) return cb(null, false);
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  return valid ? cb(null, user) : cb(null, false);
}));

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  cb(null, result.rows[0]);
});

// Register route
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashed]);
  res.status(201).json({ message: "User registered!" });
});

// Login route
app.post("/auth/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in", user: req.user });
});

// ✅ GET all notes for logged-in user
app.get("/notes", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id])
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// ✅ POST create a new note
app.post("/notes", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { title, content } = req.body;
  db.query(
    "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
    [req.user.id, title, content]
  )
    .then((result) => res.status(201).json(result.rows[0]))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// ✅ DELETE a note by ID
app.delete("/notes/:id", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const noteId = req.params.id;
  db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [noteId, req.user.id])
    .then(() => res.json({ message: "Note deleted" }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
