const express = require("express");
const bodyParser = require("body-parser");
var entities = require("./src/routes/entities");
var images = require("./src/routes/images");
var generator = require("./src/routes/generator");

const app = express();
const port = process.env.PORT || 5000;

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
//make folder public
app.use("/img/", express.static("img"));
//Routes
app.use("/api/entities", entities);
app.use("/api/images/", images);
app.use("/api/generator/", generator);

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
