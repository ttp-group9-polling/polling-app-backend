
// models/Vote.js - Defines each vote and prevents duplicate votes.
const { DataTypes } = require("sequelize");
const db = require("../db");

const Vote = db.define(
  "Vote",
  {
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    optionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    voterEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["pollId", "voterEmail"],
      },
    ],
  }
);

module.exports = Vote; // Allows other files to use this model