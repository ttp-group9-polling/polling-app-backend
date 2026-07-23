// app.js - Starts the server and connects it to the database.
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { db } = require("./models");
const pollRouter = require("./routes/Polls");
const optionRouter = require("./routes/Options");
const voteRouter = require("./routes/Votes");

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up server middleware.
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Checks that the server is running.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connects each API path to its routes.
app.use("/api/polls", pollRouter);
app.use("/api/options", optionRouter);
app.use("/api/votes", voteRouter);

// Connects to the database and starts the server.
async function startApp() {
  try {
    await db.authenticate();
    console.log("Database connection established.");

    await db.sync();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database startup failed:", error);
  }
}

startApp();