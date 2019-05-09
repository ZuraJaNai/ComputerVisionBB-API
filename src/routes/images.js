const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const hound = require("hound");
const watcher = hound.watch("./img/");
const axios = require("axios");
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

const deleteImageShapes = name => {
  const images = JSON.parse(fs.readFileSync("./src/data/labeledImages.json"));
  const index = images.findIndex(obj => obj.image.name === name);
  if (index >= 0) {
    images.splice(index, 1);
    fs.writeFileSync("./src/data/labeledImages.json", JSON.stringify(images));
  }
};

const downloadGDriveImages = (folderId, accessToken) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const baseUrl = "https://www.googleapis.com/drive/v3/files";
  const url = `${baseUrl}?q=parents%20in%20'${folderId}'`;
  return axios.get(url, { headers }).then(res => {
    const files = res.data.files;
    files.forEach(file => {
      console.log(file);
      if (file.mimeType === "application/vnd.google-apps.folder") {
        downloadGDriveImages(file.id, accessToken);
      } else {
        const imgPath = path.resolve("img", file.name);
        const writer = fs.createWriteStream(imgPath);
        axios
          .get(`${baseUrl}/${file.id}`, {
            headers,
            params: { alt: "media" },
            responseType: "stream",
          })
          .then(res => {
            res.data.pipe(writer);
          });
      }
    });
  });
};

const getFolderId = url => {
  // get folder id from url
  return "1IWD3_xbGQv23892IJ0mzIoCQwjCaz9V3";
};
// @route GET api/images
// @desc   get list of all images
router.get("/", (req, res) => {
  let imagesJSON = JSON.parse(
    fs.readFileSync(__dirname + "/../data/images.json")
  );
  res
    .status(200)
    .json(imagesJSON)
    .end();
});

// @route POST api/images
// @desc   new image
router.post("/", upload.single("targetImage"), (req, res) => {
  res
    .status(201)
    .json(images)
    .end();
});

// @route POST api/images
// @desc   new images from google drive
router.post("/gdrive", (req, res) => {
  const { url, accessToken } = req.body;
  const folderId = getFolderId(url);
  downloadGDriveImages(folderId, accessToken);
  //need to wait until the end of downloading
  res
    .status(201)
    .json(images)
    .send();
});

// @route DELETE api/images
// @desc   delete image
router.delete("/img/:imgName", (req, res) => {
  let path = req.params.imgName;
  if (fs.existsSync("./img/" + path)) {
    deleteImageShapes(path);
    fs.unlinkSync("./img/" + path);
    res.status(200).send();
  } else {
    console.log("no file");
  }
});

// @route POST api/images
// @desc   reset all

router.delete("/reset", (req, res) => {
  // reset entities
  fs.writeFileSync("./src/data/entities.json", JSON.stringify([]));
  // reset shapes
  fs.writeFileSync("./src/data/labeledImages.json", JSON.stringify([]));
  // delete images
  fs.readdir("./img/", (err, items) => {
    for (let i = 0; i < items.length; i++) {
      if (fs.existsSync("./img/" + items[i])) {
        deleteImageShapes(items[i]);
        fs.unlinkSync("./img/" + items[i]);
      } else {
        console.log("no file");
      }
    }
  });
  res.status(200).end();
});

module.exports = router;
