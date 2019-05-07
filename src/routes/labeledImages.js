const express = require('express');
const router = express.Router();
const fs = require('fs');

// @route GET api/labeled
// @desc  get labels of image
router.get("/:imageName", (req, res) => {
  name = req.params.imageName;
  let images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  let labeledImage = images.find(obj => {
    return obj.image.name === name;
  });
  res
    .status(200)
    .json(labeledImage)
    .end();
});

// @route POST api/labeled
// @desc  add labels to image
router.post("/", (req, res) => {
  labeledImage = req.body;
  const images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  data = JSON.stringify(addOrReplaceImage(images, labeledImage));
  fs.writeFileSync('./src/data/labeledImages.json', data);
  res.status(201).send();
});

// @route DELETE api/labeled
// @desc  delete ALL images with shapes
router.delete("/", (req, res) => {
  const data = [];
  fs.writeFileSync("./src/data/labeledImages.json", data);
});

function addOrReplaceImage(images, labeledImage) {
  let name = labeledImage.image.name;
  const index = images.findIndex(obj => obj.image.name === name);
  index >= 0 ? (images[index] = labeledImage) : images.push(labeledImage);
  return images;
}
module.exports = router;
