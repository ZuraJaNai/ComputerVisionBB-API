const express = require("express");
const router = express.Router();
const fs = require("fs");
const konva = require("konva");
let entities = require("../data/entities");

// @route GET api/entities
// @desc get list of all entities
router.get("/", (req, res) => {
  let entitiesJSON = JSON.parse(
    fs.readFileSync(__dirname + "/../data/entities.json")
  );
  res.status(200).json(entitiesJSON);
});

// @route POST api/entities
// @desc   new entity
router.post("/", (req, res) => {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].color === req.body.color) {
      req.body.color = konva.Util.getRandomColor();
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
