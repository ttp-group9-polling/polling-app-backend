const { DataTypes } = require("sequelize");
const db = require("../db");

const Poll = db.define("Poll", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Poll;
