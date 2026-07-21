const express = require("express");
const router = express.Router();

const { Vote, Option } = require("../models");

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
    const { pollId, optionId, voterId } = req.body;

    if (!pollId || !optionId || !voterId) {
      return res.status(400).json({
        error: "pollId, optionId, and voterId are required",
      });
    }

    const option = await Option.findByPk(optionId);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    if (option.pollId !== pollId) {
      return res.status(400).json({
        error: "This option does not belong to the selected poll",
      });
    }

    const vote = await Vote.create({
      pollId,
      optionId,
      voterId,
    });

    res.status(201).json(vote);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "This voter has already voted in this poll",
      });
    }

    res.status(400).json({ error: error.message });
  }
});

module.exports = router;