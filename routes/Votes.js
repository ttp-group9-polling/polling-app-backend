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
    const { optionId } = req.body;

    const option = await Option.findByPk(optionId);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    const vote = await Vote.create({ optionId });

    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;