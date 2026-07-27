// models/index.js - Connects the database models and their relationships.
const db = require("../db");
const Poll = require("./Poll");
const Option = require("./Option");
const Vote = require("./Vote");

// Connects polls and options.
Poll.hasMany(Option, {
  foreignKey: "pollId",
  as: "options",
  onDelete: "CASCADE",
});

Option.belongsTo(Poll, {
  foreignKey: "pollId",
  as: "poll",
});

// Connects polls and votes.
Poll.hasMany(Vote, {
  foreignKey: "pollId",
  onDelete: "CASCADE",
});

Vote.belongsTo(Poll, {
  foreignKey: "pollId",
});

// Connects options and votes.
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