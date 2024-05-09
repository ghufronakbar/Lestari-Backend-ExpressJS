const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

//parse application json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//routes
var routes = require("./routes");
app.use("/v1/mob/image/", express.static("upload/images"));
app.use("/v1/mob/image/profile", express.static("upload/profile"));
app.use("/v1/data/", express.static("data"));
routes(app);

app.listen(5000, () => {
  console.log(`Server started on port`);
});
