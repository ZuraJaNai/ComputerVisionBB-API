const express = require('express');
const bodyParser = require('body-parser');
const entities = require('./src/routes/entities');
const images = require('./src/routes/images');
const generator = require('./src/routes/generator');
const labeledImages = require('./src/routes/labeledImages');

const app = express();
const port = process.env.PORT || 5000;

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(bodyParser.json());
// make folder public
app.use('/img/', express.static('img'));
app.use('/public/', express.static('public'));

// Routes
app.use('/api/entities', entities);
app.use('/api/images/', images);
app.use('/api/labeled/', labeledImages);
app.use('/api/generator/', generator);

const server = app.listen(port, () => console.log(`Server up and running on port ${port} !`),);

module.exports = server;
