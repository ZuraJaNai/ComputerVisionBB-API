const express = require("express");
const router = express.Router();
const fs = require("fs");
var entities = require("../data/entities");

// @route GET api/entities
// @desc get list of all entities
router.get("/", (req, res) => {
  res.status(200).json(entities);
});

// @route POST api/entities
// @desc   new entity
router.post("/", (req, res) => {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].color === req.body.color) {
      req.body.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  }
  const entity = {
    index: entities.length,
    ...req.body
  };
  entities.push(entity);
  let data = JSON.stringify(entities);
  fs.writeFileSync("./src/data/entities.json", data);
  res.status(201).json(entity);
});

module.exports = router;
