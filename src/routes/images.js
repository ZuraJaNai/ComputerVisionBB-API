const express = require("express");
const router = express.Router();
const fs = require("fs");
let images = require("../data/images");
const hound = require("hound");
const watcher = hound.watch("./img/");

const multer = require("multer");

/*modify json on folder change*/
watcher.on("create", () => {
  folderOnChange();
});
watcher.on("delete", () => {
  folderOnChange();
});

const folderOnChange = () => {
  fs.readdir("./img/", (err, items) => {
    items = items.sort(
      (a, b) =>
        fs.statSync("./img/" + b).mtime.getTime() -
        fs.statSync("./img/" + a).mtime.getTime()
    );
    let imagesEmpty = [];
    if (items.length === 0) {
      console.log("empty");
      let data = JSON.stringify(imagesEmpty);
      fs.writeFileSync("./src/data/images.json", data);
    } else {
      console.log(items);
      for (let i = 0; i < items.length; i++) {
        let image = {
          _id: imagesEmpty.length,
          index: imagesEmpty.length,
          picture: "http://localhost:5000/img/" + items[i]
        };
        imagesEmpty.push(image);
        let data = JSON.stringify(imagesEmpty);
        fs.writeFileSync("./src/data/images.json", data);
      }
    }
  });
};

/*store data in this folder*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./img/");
  },
  filename: (req, file, cb) => {
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

/*request*/
router.get("/", (req, res) => {
  res.status(200).json(images);
});

router.post("/", upload.single("targetImage"), (req, res) => {
  folderOnChange();
  res.status(201).json(images);
});

module.exports = router;
