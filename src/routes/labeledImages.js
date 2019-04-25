const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/:imageName', (req, res) => {
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

router.post('/', (req, res) => {
  labeledImage = req.body;
  const images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  data = JSON.stringify(addOrReplaceImage(images, labeledImage));
  fs.writeFileSync('./src/data/labeledImages.json', data);
  res.status(201).end();
});

function addOrReplaceImage(images, labeledImage) {
  name = labeledImage.image.name;
  const index = images.findIndex(obj => obj.image.name === name);
  index >= 0 ? (images[index] = labeledImage) : images.push(labeledImage);
  return images;
}
module.exports = router;
