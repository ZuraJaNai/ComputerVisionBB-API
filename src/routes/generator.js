const express = require("express");
const router = express.Router();
var builder = require("xmlbuilder");

router.post("/", (req, res) => {
  const imageName = req.body.image;
  const labeledShapes = req.body.shapes;
  var xml = builder
    .create("annotation")
    .ele("filename", imageName)
    .up();
  labeledShapes.forEach(shape => {
    xml
      .ele("object")
      .ele("name", shape.label)
      .up()
      .ele("bndbox")
      .ele("xmin", shape.x)
      .up()
      .ele("ymin", shape.y)
      .up()
      .ele("xmax", shape.x + shape.width)
      .up()
      .ele("ymax", shape.y + shape.height)
      .up()
      .up()
      .up();
  });
  console.log(xml.end({ pretty: true }));
  res.status(200).send();
});

module.exports = router;
