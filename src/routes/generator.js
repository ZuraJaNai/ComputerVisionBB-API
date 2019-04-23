const express = require("express");
const router = express.Router();
const builder = require("xmlbuilder");
const archiver = require("archiver");
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
  //add pictures which are labeled to archive ???
  res.setHeader("Content-Type", "application/zip");
  pipeZipToRes(req, res);
  //delete xml files
});

function pipeZipToRes(req, res) {
  const zipfile = archiver("zip");

  zipfile.on("error", err => {
    throw err;
  });

  zipfile.pipe(res);

  zipfile.directory("./output", false).finalize();
}

module.exports = router;
