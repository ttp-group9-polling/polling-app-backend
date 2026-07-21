const express = require("express");
const router = express.Router();
const { Option } = require("../models");

//Get All Options
router.get("/", async (req, res) => {
  const options = await Option.findAll();
  res.json(options);
});

//Get one Option by ID
router.get("/:id", (req, res) => {
    const options = await Option.findByPk(req.params.id);
    if (!options) {
        return res.status(404).json({ error: "Option not found!" });
    }
    res.json(options);
});

//Create an Option
router.post("/", async (req, res) => {
    const options = await Option.create(req.body);
    res.status(201).json(options);
});

//Update an Option
router.patch("/:id", async (req, res) => {
    const options = await Option.findByPk(req.params.id);
    if (!options) {
        return res.status(404).json({ error: "Option not found!" });
    }
    await Option.update(req.body);
    res.json(options);
});

//Delete an Option
router.delete("/:id", async (req, res) => {
    const options = await Option.findByPk(req.params.id);
    if(!options) {
        return res.status(404).json({ error: "Option not found!" });
    }
    await options.destroy();
    res.sendStatus(204);
})

module.exports = router;
