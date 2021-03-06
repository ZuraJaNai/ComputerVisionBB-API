/* eslint-disable no-undef */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = express.Router();
const builder = require('xmlbuilder');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

function deleteFilesInDir(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (error) => {
        if (error) throw error;
      });
    }
  });
}

function pipeZipToRes(req, res, directory) {
  const zipfile = archiver('zip');

  zipfile.on('error', (err) => {
    throw err;
  });

  zipfile.on('end', () => {
    deleteFilesInDir(directory);
  });

  zipfile.pipe(res);

  zipfile.directory(directory, false).finalize();
}

function createXML(image, shapes, directory) {
  const xml = builder
    .create('annotation')
    .ele('filename', image.name)
    .up()
    .ele('size')
    .ele('width', image.width)
    .up()
    .ele('height', image.height)
    .up()
    .up();
  shapes.forEach((shape) => {
    xml
      .ele('object')
      .ele('name', shape.label)
      .up()
      .ele('bndbox')
      .ele('xmin', shape.x)
      .up()
      .ele('ymin', shape.y)
      .up()
      .ele('xmax', shape.x + shape.width)
      .up()
      .ele('ymax', shape.y + shape.height)
      .up()
      .up()
      .up();
  });
  data = xml.end({ pretty: true });
  fs.writeFileSync(`${directory}/${image.name}.xml`, data);
}

router.get('/', (req, res) => {
  const directory = './output';
  const labeledImages = JSON.parse(
    fs.readFileSync('./src/data/labeledImages.json'),
  );
  labeledImages.forEach((obj) => {
    if(obj.shapes.length > 0){
      createXML(obj.image, obj.shapes, directory);
    }
  });
  res.setHeader('Content-Type', 'application/zip');
  pipeZipToRes(req, res, directory);
});

module.exports = router;
