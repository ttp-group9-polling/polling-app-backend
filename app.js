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

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/polls", pollRouter);
app.use("/api/options", optionRouter);
app.use("/api/votes", voteRouter);

async function startApp() {
  try {
    await db.authenticate();
    console.log("Database connection established.");

    // await db.sync({ force: true });

    // Sync our Sequelize models with the actual database tables.
    // IMPORTANT: no { force: true } here — that option DROPS and
    // recreates every table on every server start/restart, wiping
    // all real data. { force: true } belongs only in seed.js, where
    // wiping and reseeding is exactly what we want. A plain db.sync()
    // just creates tables if they don't exist yet and otherwise leaves
    // existing data alone.
    await db.sync(); 

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database startup failed:", error);
  }
}

startApp();
