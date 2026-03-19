const express = require("express");

const app = express();
const PORT = 5001;

// ✅ middleware to parse JSON
app.use(express.json());

// ✅ test route
app.get("/", (req, res) => {
  res.send("EchoFlow API is running...");
});

// ✅ start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});