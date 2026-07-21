const db = require("../db");
const Option = require("./Option");
const Poll = require("./Poll");
const Vote = require("./Vote");

Poll.hasMany(Option, { foreignKey: "pollId" });
Option.belongsTo(Poll, { foreignKey: "pollId" });

Option.hasMany(Vote, { foreignKey: "optionId" });
Vote.belongsTo(Option, { foreignKey: "optionId" });

Poll.hasMany(Vote, { foreignKey: "pollId" });
Vote.belongsTo(Poll, { foreignKey: "pollId" });

module.exports = { db, Option, Vote, Poll };
