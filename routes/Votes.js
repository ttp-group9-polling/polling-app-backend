const express = require("express");
const router = express.Router();
const { UniqueConstraintError } = require("sequelize");

const { Vote, Option, Poll } = require("../models");

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

router.post("/", async (req, res) => {
  try {
    const { optionId, pollId, voterEmail } = req.body;

    if (!optionId || !pollId || !voterEmail) {
      return res
        .status(400)
        .json({ error: "optionId, pollId, and voterEmail are required" });
    }

    const normalizedEmail = voterEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ error: "voterEmail is required" });
    }

    const poll = await Poll.findByPk(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const option = await Option.findByPk(optionId);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    if (option.pollId !== Number(pollId)) {
      return res
        .status(400)
        .json({ error: "Option does not belong to selected poll" });
    }

    const existingVote = await Vote.findOne({
      where: { pollId, voterEmail: normalizedEmail },
    });

    if (existingVote) {
      return res
        .status(409)
        .json({ error: "This email has already voted in this poll" });
    }

    const vote = await Vote.create({
      optionId,
      pollId,
      voterEmail: normalizedEmail,
    });

    res.status(201).json(vote);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .json({ error: "This email has already voted in this poll" });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;