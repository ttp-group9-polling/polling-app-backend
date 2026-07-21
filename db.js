const { Sequelize } = require("sequelize");

// I made it this way, because my laptop runs on a Linux OS
// So it might be different to how Mac and Windows do it
// - Rehman Mohammad
const db = new Sequelize(
  `postgres://postgres:root@localhost:5432/polling-app`,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
);

module.exports = db;
