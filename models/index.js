const db = require("../db");
const Poll = require("./Poll");
const Option = require("./Option");
const Vote = require("./Vote");

Poll.hasMany(Option, {
  foreignKey: "pollId",
  onDelete: "CASCADE",
});

Option.belongsTo(Poll, {
  foreignKey: "pollId",
});

Poll.hasMany(Vote, {
  foreignKey: "pollId",
  onDelete: "CASCADE",
});

Vote.belongsTo(Poll, {
  foreignKey: "pollId",
});

Option.hasMany(Vote, {
  foreignKey: "optionId",
  onDelete: "CASCADE",
});

Vote.belongsTo(Option, {
  foreignKey: "optionId",
});

module.exports = {
  db,
  Poll,
  Option,
  Vote,
};