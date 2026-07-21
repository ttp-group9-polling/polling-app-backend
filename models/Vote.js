const { DataTypes } = require("sequelize");
const Option = require("./Option");
const Poll = require("./Poll");
const db = require("../db");

const Vote = db.define("Vote", {
  optionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Option,
      key: "id",
    },
  },
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Poll,
      key: "id",
    },
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
});

module.exports = Vote;
