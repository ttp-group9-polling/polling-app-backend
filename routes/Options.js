const express = require("express");
const router = express.Router();

const { Option } = require("../models");

router.get("/", async (req, res) => {
  try {
    const options = await Option.findAll();
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    res.json(option);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const option = await Option.create(req.body);
    res.status(201).json(option);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    await option.update(req.body);
    res.json(option);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    await option.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;