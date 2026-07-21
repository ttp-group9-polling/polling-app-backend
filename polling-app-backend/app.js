const express = require("express");
const PORT = 3000;
const { db } = require("./models");
const morgan = require("morgan");
const cors = require("cors");
const pollRouter = require("./routes/Polls");
const optionRouter = require("./models/Option");
const app = express();

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/polls", pollRouter);
app.use("/options", optionRouter);

db.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT} `);
    });
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });

app.use(logger);
