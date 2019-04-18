const express = require("express");
const router = express.Router();
const fs = require("fs");
const konva = require("konva");
// let entities = require("../data/entities");

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
  let entitiesJSON = JSON.parse(
    fs.readFileSync(__dirname + "/../data/entities.json")
  );
  for (let i = 0; i < entitiesJSON.length; i++) {
    if (entitiesJSON[i].color === req.body.color) {
      req.body.color = konva.Util.getRandomColor();
    }
  }
  const entity = {
    index: entitiesJSON.length,
    ...req.body
  };
  entitiesJSON.push(entity);
  let data = JSON.stringify(entitiesJSON);
  fs.writeFileSync("./src/data/entities.json", data);
  res.status(201).json(entity);
});

router.delete("/:index", (req, res) => {
  let data;
  let newEntitesJSON = [];
  let entitiesJSON = JSON.parse(
    fs.readFileSync(__dirname + "/../data/entities.json")
  );
  for (let i = 0; i < entitiesJSON.length; i++) {
    if (entitiesJSON[i].index == req.params.index) {
      continue;
    } else {
      let newEntity = {
        index: newEntitesJSON.length,
        color: entitiesJSON[i].color,
        label: entitiesJSON[i].label
      };
      newEntitesJSON.push(newEntity);
    }
  }
  data = JSON.stringify(newEntitesJSON);
  fs.writeFileSync("./src/data/entities.json", data);
  res.status(200).json(data);
});

module.exports = router;
