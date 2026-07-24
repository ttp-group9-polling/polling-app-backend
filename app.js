// app.js - Starts the server and connects it to the database.

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { db } = require("./models");
const pollRouter = require("./routes/Polls");

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

// Connects the polls API path to the poll routes.
app.use("/api/polls", pollRouter);

// Handles errors sent by next(err).
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Something went wrong",
  });
});

// Connects to the database and starts the server.
async function startApp() {
  try {
    await db.authenticate();
    console.log("Database connection established.");

    // Syncs the models without deleting existing data.
    await db.sync();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database startup failed:", err);
  }
}

startApp();
