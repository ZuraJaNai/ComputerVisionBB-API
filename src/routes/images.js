const express = require("express");
const router = express.Router();
const fs = require("fs");
let images = require("../data/images");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./img/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// filter by file type
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("incorrect file format"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/", (req, res) => {
  res.status(200).json(images);
});

router.post("/", upload.single("targetImage"), (req, res) => {
  const image = {
    _id: images.length,
    index: images.length,
    picture: "http://localhost:5000/img/" + req.file.originalname
  };
  images.push(image);
  let data = JSON.stringify(images);
  fs.writeFileSync("./src/data/images.json", data);
  res.status(201).json(image);
});
module.exports = router;
