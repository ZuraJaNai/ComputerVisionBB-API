const express = require("express");
const router = express.Router();
const builder = require("xmlbuilder");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const directory = "./output";
  const labeledImages = JSON.parse(
    fs.readFileSync("./src/data/labeledImages.json")
  );
  labeledImages.forEach(element => {
    createXML(element.image, element.shapes, directory);
  });
  res.setHeader("Content-Type", "application/zip");
  pipeZipToRes(req, res, directory);
});

function createXML(image, shapes, directory) {
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
  shapes.forEach(shape => {
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
  fs.writeFileSync(`${directory}/${image.name}.xml`, data);
}

function pipeZipToRes(req, res, directory) {
  const zipfile = archiver("zip");

  zipfile.on("error", err => {
    throw err;
  });

  zipfile.on("end", function() {
    deleteFilesInDir(directory);
  });

  zipfile.pipe(res);

  zipfile.directory(directory, false).finalize();
}

function deleteFilesInDir(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

module.exports = router;
