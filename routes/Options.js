// routes/Options.js - Handles creating, viewing, updating, and deleting options.

const express = require("express");
const router = express.Router();

const { Option } = require("../models");

// GET all options
router.get("/", async (req, res, next) => {
  try {
    const options = await Option.findAll();
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// GET one option
router.get("/:id", async (req, res, next) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({
        error: "Option not found",
      });
    }

    res.json(option);
  } catch (err) {
    next(err);
  }
});

// CREATE an option
router.post("/", async (req, res, next) => {
  try {
    const option = await Option.create(req.body);
    res.status(201).json(option);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: err.errors[0].message,
      });
    }

    next(err);
  }
});

// UPDATE an option
router.patch("/:id", async (req, res, next) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({
        error: "Option not found",
      });
    }

    await option.update(req.body);
    res.json(option);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: err.errors[0].message,
      });
    }

    next(err);
  }
});

// DELETE an option
router.delete("/:id", async (req, res, next) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({
        error: "Option not found",
      });
    }

    await option.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
