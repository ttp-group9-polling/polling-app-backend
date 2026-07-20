const express = require("express");
const PORT = 3000;
const { db } = require("./models");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT} `);
  });
});
