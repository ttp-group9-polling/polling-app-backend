
// models/Option.js - Defines the choices that belong to each poll.

const { DataTypes } = require("sequelize");
const Poll = require("./Poll");
const db = require("../db");

const Option = db.define("Option", {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  pollId: {
    type: DataTypes.INTEGER,
    references: {
      model: Poll,
      key: "id",
    },
  },
});

module.exports = Option; // Allows other files to use this model
