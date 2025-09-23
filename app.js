const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Recycling SaaS Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
