const express = require("express");
const router = express.Router();
const { Poll } = require("../models");

//Get all Polls
router.get("/", async (req, res) => {
  const poll = await Poll.findAll();
  res.json(poll);
});

//Get one Poll by its ID #
router.get("/:id", async (req, res) => {
  const poll = await Poll.findByPk(req.params.id);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found!" });
  }
  res.json(poll);
});

//Creating a New Poll
router.post("/", async (req, res) => {
  const poll = await Poll.create(req.body);
  res.status(201).json(poll);
});

//Update a Poll
router.patch("/:id", async (req, res) => {
  const poll = await Poll.findByPk(req.params.id);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found!" });
  }
  await poll.update(req.body);
  res.json(poll);
});

//Deleting a Poll
router.delete("/:id", async (req, res) => {
  const poll = await Poll.findByPk(req.params.id);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found!" });
  }
  await poll.destroy();
  res.sendStatus(204);
});

module.exports = router;
