const { Sequelize } = require("sequelize");

const db = new Sequelize(
  `postgres://postgres:root@localhost:5432/polling-app`,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
);

module.exports = db;
