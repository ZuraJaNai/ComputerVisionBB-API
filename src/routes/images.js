const express = require('express');

const router = express.Router();

const fs = require('fs');
const path = require('path');
const hound = require('hound');

const watcher = hound.watch('./img/');
const axios = require('axios');
const multer = require('multer');
const images = require('../data/images');

// Folder 'on change' listeners.
watcher.on('create', () => {
  folderOnChange();
});
watcher.on('delete', () => {
  folderOnChange();
});

// Do some actions if folder change.
const folderOnChange = () => {
  fs.readdir('./img/', (err, items) => {
    // sort by date
    items = items.sort(
      (a, b) => fs.statSync(`./img/${b}`).mtime.getTime()
        - fs.statSync(`./img/${a}`).mtime.getTime(),
    );
    const imagesEmpty = [];
    // if 0 img -> empty JSON
    if (items.length === 0) {
      const data = JSON.stringify(imagesEmpty);
      fs.writeFileSync('./src/data/images.json', data);
    } else {
      for (let i = 0; i < items.length; i++) {
        const image = {
          _id: imagesEmpty.length,
          index: imagesEmpty.length,
          picture: `img/${items[i]}`,
        };
        imagesEmpty.push(image);
        const data = JSON.stringify(imagesEmpty);
        fs.writeFileSync('./src/data/images.json', data);
      }
    }
  });
};

// Choose file for data storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './img/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});
// Addition file filter by file type.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('incorrect file format'), false);
  }
};
const upload = multer({ storage, fileFilter });

const deleteImageShapes = (name) => {
  const images = JSON.parse(fs.readFileSync('./src/data/labeledImages.json'));
  const index = images.findIndex(obj => obj.image.name === name);
  if (index >= 0) {
    images.splice(index, 1);
    fs.writeFileSync('./src/data/labeledImages.json', JSON.stringify(images));
  }
};

const getBaseFolder = (url, baseUrl, headers) => {
  // parse url and get folderId
  const from = url.lastIndexOf('/') + 1;
  const to = url.indexOf('?usp=sharing');
  const folderId = url.substring(from, to);
  return axios
    .get(`${baseUrl}/${folderId}`, {
      headers,
    })
    .then(result => result.data);
};

const downloadFile = (file, baseUrl, headers) => {
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    return axios
      .get(`${baseUrl}?q=parents%20in%20'${file.id}'`, {
        headers,
      })
      .then(result => downloadFromFolder(result.data.files, baseUrl, headers))
      .catch((error) => {
        console.log(error);
      });
  }
  const imgPath = path.resolve('img', `${Date.now()}.${file.name}`);
  const writer = fs.createWriteStream(imgPath);
  return axios
    .get(`${baseUrl}/${file.id}`, {
      headers,
      params: { alt: 'media' },
      responseType: 'stream',
    })
    .then((res) => {
      res.data.pipe(writer);
      return Promise.resolve();
    })
    .catch((error) => {
      console.log(error);
    });
};

const downloadFromFolder = async (files, baseUrl, headers) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    await downloadFile(file, baseUrl, headers);
  }
};

// @route GET api/images
// @desc   get list of all images
router.get('/', (req, res) => {
  const imagesJSON = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/images.json`),
  );
  res
    .status(200)
    .json(imagesJSON)
    .end();
});

// @route POST api/images
// @desc   new image
router.post('/', upload.single('targetImage'), (req, res) => {
  res
    .status(201)
    .json(images)
    .end();
});

// @route POST api/images
// @desc   new images from google drive
router.post('/gdrive', async (req, res) => {
  const { url, accessToken } = req.body;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const baseUrl = 'https://www.googleapis.com/drive/v3/files';
  const folder = await getBaseFolder(url, baseUrl, headers);
  await downloadFromFolder(new Array(folder), baseUrl, headers);
  res.status(201).send();
});

// @route DELETE api/images
// @desc   delete image
router.delete('/img/:imgName', (req, res) => {
  const path = req.params.imgName;
  if (fs.existsSync(`./img/${path}`)) {
    deleteImageShapes(path);
    fs.unlinkSync(`./img/${path}`);
    res.status(200).send();
  } else {
    console.log('no file');
  }
});

// @route POST api/images
// @desc   reset all

router.delete('/reset', (req, res) => {
  // reset entities
  fs.writeFileSync('./src/data/entities.json', JSON.stringify([]));
  // reset shapes
  fs.writeFileSync('./src/data/labeledImages.json', JSON.stringify([]));
  // delete images
  fs.readdir('./img/', (err, items) => {
    for (let i = 0; i < items.length; i++) {
      if (fs.existsSync(`./img/${items[i]}`)) {
        deleteImageShapes(items[i]);
        fs.unlinkSync(`./img/${items[i]}`);
      } else {
        console.log('no file');
      }
    }
  });
  res.status(200).end();
});

module.exports = router;
