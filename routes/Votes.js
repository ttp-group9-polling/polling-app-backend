// routes/Votes.js - Handles viewing and creating votes.
const express = require("express");
const router = express.Router();

const { Vote, Option } = require("../models");

// Gets all votes with their options.
router.get("/", async (req, res) => {
  try {
    const votes = await Vote.findAll({
      include: Option,
    });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Creates a new vote.
router.post("/", async (req, res) => {
  try {
    const { pollId, optionId, voterEmail } = req.body;

    if (!pollId || !optionId || !voterEmail) {
      return res.status(400).json({
        error: "pollId, optionId, and voterEmail are required",
      });
    }

    const normalizedEmail = voterEmail.trim().toLowerCase();

    const option = await Option.findByPk(optionId);

    if (!option) {
      return res.status(404).json({
        error: "Option not found",
      });
    }

     // Checks that the option belongs to the selected poll.
    if (option.pollId !== Number(pollId)) {
      return res.status(400).json({
        error: "This option does not belong to this poll",
      });
    }

    const vote = await Vote.create({
      pollId: Number(pollId),
      optionId: Number(optionId),
      voterEmail: normalizedEmail,
    });

    res.status(201).json(vote);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "This email has already voted in this poll",
      });
    }

    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router; // Allows app.js to use these routes