import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB error:", err));

// Session store (Atlas only)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}));

// Auth middleware
function requireAuth(role) {
  return (req, res, next) => {
    if (!req.session.userId) return res.redirect("/login");
    if (role && req.session.role !== role) return res.status(403).send("Forbidden");
    next();
  };
}

// View engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// -------------------- Routes -------------------- //

// Root route
app.get("/", (req, res) => {
  res.render("home");
});

// Test EJS rendering
app.get("/test", (req, res) => {
  res.render("test"); // expects views/test.ejs
});

// Login / Signup pages
app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ name, email, password: hashed, role });
    res.redirect("/login");
  } catch (err) {
    res.status(400).send("Signup error: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("No user found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  req.session.userId = user._id;
  req.session.role = user.role;
  res.redirect("/dashboard/" + user.role.toLowerCase());
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // clear session cookie
    res.redirect("/login");
  });
});

// Dashboards (protected)
app.get("/dashboard/user", requireAuth("USER"), (req, res) => {
  res.render("dashboards/user", { user: req.session });
});

app.get("/dashboard/business", requireAuth("BUSINESS"), (req, res) => {
  res.render("dashboards/business", { user: req.session });
});

app.get("/dashboard/sponsor", requireAuth("SPONSOR"), (req, res) => {
  res.render("dashboards/sponsor", { user: req.session });
});

app.get("/dashboard/admin", requireAuth("ADMIN"), (req, res) => {
  res.render("dashboards/admin", { user: req.session });
});

// ------------------------------------------------ //

// Start server
app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
