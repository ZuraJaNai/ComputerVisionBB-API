/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

const express = require('express');

const router = express.Router();
const fs = require('fs');

function addOrReplaceImage(images, labeledImage) {
  const { name } = labeledImage.image;
  const index = images.findIndex(obj => obj.image.name === name);
  index >= 0 ? (images[index] = labeledImage) : images.push(labeledImage);
  return images;
}

// @route GET api/labeled
// @desc  get labels of image
router.get('/:imageName', (req, res) => {
  const name = req.params.imageName;
  const images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  const labeledImage = images.find(obj => obj.image.name === name);
  res
    .status(200)
    .json(labeledImage)
    .end();
});

// @route POST api/labeled
// @desc  add labels to image
router.post('/', (req, res) => {
  const labeledImage = req.body;
  const images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  const data = JSON.stringify(addOrReplaceImage(images, labeledImage));
  fs.writeFileSync('./src/data/labeledImages.json', data);
  res.status(201).send();
});

// @route DELETE api/labeled
// @desc  delete ALL images with shapes
router.delete('/', () => {
  const data = [];
  fs.writeFileSync('./src/data/labeledImages.json', data);
});
module.exports = router;
