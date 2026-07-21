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

module.exports = Option;
