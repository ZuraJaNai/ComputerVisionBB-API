const express = require("express");
const router = express.Router();
var builder = require("xmlbuilder");
const fs = require("fs");

router.get("/", (req, res) => {
  const images = JSON.parse(fs.readFileSync("./src/data/labeledImages.json"));
  images.forEach(element => {
    const image = element.image;
    const labeledShapes = element.shapes;
    var xml = builder
      .create("annotation")
      .ele("filename", image.name)
      .up()
      .ele("size")
      .ele("width", image.width)
      .up()
      .ele("height", image.height)
      .up()
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
    data = xml.end({ pretty: true });
    fs.writeFileSync(`./output/${image.name}.xml`, data);
  });
  //create archive and send it
  //delete xml files
  res.status(200).send();
});

module.exports = router;
