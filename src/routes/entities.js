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
