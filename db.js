require("dotenv").config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: process.env.DATABASE_URL.includes("neon.tech")
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

module.exports = db;
