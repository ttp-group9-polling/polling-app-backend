// routes/Polls.js - Handles creating polls, viewing polls, and voting.
const express = require("express");
const router = express.Router();

const { Poll, Option, Vote } = require("../models");

// Checks the information needed to create a poll.
function requirePollFields(req, res, next) {
  const { title, description, options } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "title and description are required" });
  }

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "A poll needs at least 2 options" });
  }

  next();
}

// GET all polls
router.get("/", async (req, res, next) => {
  try {
    const polls = await Poll.findAll({
      include: [
        {
          model: Option,
          as: "options",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(polls);
  } catch (err) {
    next(err);
  }
});

// CREATE a poll
router.post("/", requirePollFields, async (req, res, next) => {
  try {
    const { title, description, options } = req.body;

    const poll = await Poll.create({
      title,
      description,
    });

    await Option.bulkCreate(
      options.map((text) => ({
        text,
        pollId: poll.id,
      })),
    );

    const createdPoll = await Poll.findByPk(poll.id, {
      include: [
        {
          model: Option,
          as: "options",
        },
      ],
    });

    res.status(201).json(createdPoll);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: err.errors[0].message,
      });
    }

    next(err);
  }
});

// GET one poll
router.get("/:id", async (req, res, next) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: Option,
          as: "options",
          include: [Vote],
        },
      ],
    });

    if (!poll) {
      return res.status(404).json({
        error: "Poll not found",
      });
    }

    const options = poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      pollId: option.pollId,
      voteCount: option.Votes.length,
    }));

    const totalVotes = options.reduce(
      (sum, option) => sum + option.voteCount,
      0,
    );

    res.json({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      totalVotes,
      options,
    });
  } catch (err) {
    next(err);
  }
});

// CREATE a vote
router.post("/:id/vote", async (req, res, next) => {
  try {
    const pollId = Number(req.params.id);
    const { optionId, voterEmail } = req.body;

    if (!optionId || !voterEmail) {
      return res.status(400).json({
        error: "optionId and voterEmail are required",
      });
    }

    const option = await Option.findByPk(optionId);

    if (!option) {
      return res.status(404).json({
        error: "Option not found",
      });
    }

    if (option.pollId !== pollId) {
      return res.status(400).json({
        error: "This option does not belong to this poll",
      });
    }

    const vote = await Vote.create({
      pollId,
      optionId,
      voterEmail,
    });

    res.status(201).json(vote);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "You have already voted in this poll",
      });
    }

    next(err);
  }
});

module.exports = router;
