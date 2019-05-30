const express = require('express');

const router = express.Router();
const fs = require('fs');

// @route GET api/entities
// @desc get list of all entities
router.get('/', (req, res) => {
  const entitiesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/entities.json`),
  );
  res
    .status(200)
    .json(entitiesJSON)
    .end();
});

// @route POST api/entities
// @desc   new entity
router.post('/', (req, res) => {
  const entitiesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/entities.json`),
  );
  const entity = {
    index: entitiesJSON.length,
    ...req.body,
  };
  entitiesJSON.push(entity);
  const data = JSON.stringify(entitiesJSON);
  fs.writeFileSync('./src/data/entities.json', data);
  res
    .status(201)
    .json(entity)
    .end();
});

// @route DELETE api/entities
// @desc   delete entity
router.delete('/:index', (req, res) => {
  const newEntitesJSON = [];
  const entitiesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/entities.json`),
  );
  for (let i = 0; i < entitiesJSON.length; i += 1) {
    if (entitiesJSON[i].index !== parseInt(req.params.index, 10)) {
      const newEntity = {
        index: newEntitesJSON.length,
        color: entitiesJSON[i].color,
        label: entitiesJSON[i].label,
      };
      newEntitesJSON.push(newEntity);
    }
  }
  const data = JSON.stringify(newEntitesJSON);
  fs.writeFileSync('./src/data/entities.json', data);
  res.status(200).json(data);
});

// @route PUT api/entities
// @desc   change entity
router.put('/', (req, res) => {
  const entitiesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/entities.json`),
  );
  entitiesJSON[req.body.index].label = req.body.data;
  const data = JSON.stringify(entitiesJSON);
  fs.writeFileSync('./src/data/entities.json', data);
  res
    .status(200)
    .json(data)
    .end();
});

module.exports = router;
