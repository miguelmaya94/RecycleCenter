import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Basic routes
app.get("/", (req, res) => {
  res.send("🚀 Recycling SaaS Server is running!");
});

// Demo dashboards
app.get("/dashboard/:role", (req, res) => {
  const role = req.params.role;
  const allowed = ["user", "business", "sponsor", "admin"];
  if (!allowed.includes(role)) return res.status(404).send("Not found");
  res.render(`dashboards/${role}`, { user: { name: "Demo User", role } });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// View engine
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
