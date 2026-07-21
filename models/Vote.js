const { DataTypes } = require("sequelize");
const Option = require("./Option");
const db = require("../db");

const Vote = db.define("Vote", {
  optionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Option,
      key: "id",
    },
  },
});

module.exports = Vote;
