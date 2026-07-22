const express = require("express");
const router = express.Router();

const { db, Poll, Option, Vote } = require("../models");

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: Option,
      order: [["createdAt", "DESC"]],
    });

    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, options } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "title and description are required" });
  }

  const cleanOptions = Array.isArray(options)
    ? options.map((text) => String(text).trim()).filter(Boolean)
    : [];

  if (cleanOptions.length < 2) {
    return res.status(400).json({ error: "A poll needs at least 2 options" });
  }

  const transaction = await db.transaction();

  try {
    const poll = await Poll.create({ title, description }, { transaction });

    await Option.bulkCreate(
      cleanOptions.map((text) => ({ text, pollId: poll.id })),
      { transaction }
    );

    await transaction.commit();

    const created = await Poll.findByPk(poll.id, { include: Option });
    res.status(201).json(created);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [{ model: Option, include: [Vote] }],
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const options = poll.Options.map((option) => ({
      id: option.id,
      text: option.text,
      pollId: option.pollId,
      voteCount: option.Votes.length,
    }));

    const totalVotes = options.reduce((sum, o) => sum + o.voteCount, 0);

    res.json({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      createdAt: poll.createdAt,
      totalVotes,
      options,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/vote", async (req, res) => {
  try {
    const pollId = Number(req.params.id);
    const { optionId, voterEmail } = req.body;

    if (!optionId || !voterEmail) {
      return res
        .status(400)
        .json({ error: "optionId and voterEmail are required" });
    }

    const poll = await Poll.findByPk(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const option = await Option.findByPk(optionId);
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    if (option.pollId !== pollId) {
      return res
        .status(400)
        .json({ error: "This option does not belong to this poll" });
    }

    const vote = await Vote.create({
      pollId,
      optionId: Number(optionId),
      voterEmail: String(voterEmail).trim().toLowerCase(),
    });

    res.status(201).json(vote);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "You have already voted in this poll" });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
