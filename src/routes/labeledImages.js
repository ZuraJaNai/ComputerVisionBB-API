const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/:imageName", (req, res) => {
  name = req.params.imageName;
  let images = JSON.parse(fs.readFileSync("./src/data/labeledImages.json"));
  let labeledImage = images.find(element => {
    return element.image.name === name;
  });
  res.status(200).json(labeledImage);
});

router.post("/", (req, res) => {
  labeledImage = req.body;
  let images = JSON.parse(fs.readFileSync("./src/data/labeledImages.json"));
  images.push(labeledImage);
  data = JSON.stringify(images);
  fs.writeFileSync("./src/data/labeledImages.json", data);
  res.status(201);
});

module.exports = router;
