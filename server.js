require("./models/db");
require("dotenv").config();

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const morgan = require("morgan");

var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const employeeController = require("./controllers/employeeController");

var app = express();

app.use(cookieParser()); // Add this after you initialize express.

app.use(morgan("dev"));
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, {
      complete: true
    }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);


app.get("/", (req, res) => res.render("sign-up"));

require("./controllers/auth.js")(app);

app.listen(3000, () => {
  console.log("Express server started at port : 3000");
});



module.exports = app;