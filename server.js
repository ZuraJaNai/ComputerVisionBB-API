const express = require("express");
const bodyParser = require("body-parser");
var entities = require("./src/routes/entities");

const app = express();
const port = process.env.PORT || 5000;

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//Routes
app.use("/api/entities", entities);

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
