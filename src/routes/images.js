const express = require("express");
const router = express.Router();
const fs = require("fs");
const hound = require("hound");
const watcher = hound.watch("./img/");
let images = require("../data/images");
const multer = require("multer");

// Folder 'on change' listeners.
watcher.on("create", () => {
  folderOnChange();
});
watcher.on("delete", () => {
  folderOnChange();
});
// Do some actions if folder change.
const folderOnChange = () => {
  fs.readdir("./img/", (err, items) => {
    // sort by date
    items = items.sort(
      (a, b) =>
        fs.statSync("./img/" + b).mtime.getTime() -
        fs.statSync("./img/" + a).mtime.getTime()
    );
    let imagesEmpty = [];
    // if 0 img -> empty JSON
    if (items.length === 0) {
      let data = JSON.stringify(imagesEmpty);
      fs.writeFileSync("./src/data/images.json", data);
    } else {
      for (let i = 0; i < items.length; i++) {
        let image = {
          _id: imagesEmpty.length,
          index: imagesEmpty.length,
          picture: "img/" + items[i],
        };
        imagesEmpty.push(image);
        let data = JSON.stringify(imagesEmpty);
        fs.writeFileSync("./src/data/images.json", data);
      }
    }
  });
};

// Choose file for data storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./img/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname);
  },
});
// Addition file filter by file type.
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

// @route GET api/images
// @desc   get list of all images
router.get("/", (req, res) => {
  let imagesJSON = JSON.parse(
    fs.readFileSync(__dirname + "/../data/images.json")
  );
  res.status(200).json(imagesJSON);
});

// @route POST api/images
// @desc   new image
router.post("/", upload.single("targetImage"), (req, res) => {
  res.status(201).json(images);
});

// @route DELETE api/images
// @desc   delete image
router.delete("/img/:imgName", (req, res) => {
  let path = req.params.imgName;
  if (fs.existsSync("./img/" + path)) {
    fs.unlinkSync("./img/" + path);
    res.status(200).send();
  } else {
    console.log("no file");
  }
});

module.exports = router;
