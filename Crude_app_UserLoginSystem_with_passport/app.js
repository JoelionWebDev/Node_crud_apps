const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
//const { default: mongoose } = require("mongoose");

//load config file
dotenv.config({ path: "./config/config.env" });

//passport path
require("./config/passport")(passport);

connectDB();

const app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//handlebars helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// handlebars
app.engine(
  ".hbs",
  engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));

//Session
app.use(
  session({
    secret: "my secrete",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global varaiable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

//CREATING A FILE TO STORE ALL THE TOKENS
const userTokenStore = fs.createWriteStream(
  path.join(__dirname, "userTokens.log"),
  { flags: "a" }
);
//init morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev", { stream: userTokenStore }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port: http://localhost:${PORT} `
  )
);
