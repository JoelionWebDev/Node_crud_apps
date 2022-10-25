const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const route = require("./server/routes/routes");
const session = require("express-session");

const connectDB = require("./server/database/connection");
//init express
const app = express();

app.use(
  session({
    secret: "my secret",
    saveUninitialized: true,
    resave: false,
  })
);
//middle ware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//INIT BODYPASSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init view engine
app.set("view engine", "ejs");

//CREATING A FILE TO STORE ALL THE TOKENS
const userTokenStore = fs.createWriteStream(
  path.join(__dirname, "userTokens.log"),
  { flags: "a" }
);
//init morgan
app.use(morgan("tiny", { stream: userTokenStore }));

//config.env path must be above the connectDB() else it will pup an error i.e (the Uri params expects a string)
dotenv.config({ path: ".env" });
//database/connection.js
connectDB();

// bringing in my static files
app.use("/css", express.static(path.join(__dirname, "assets/css")));
app.use("/img", express.static(path.join(__dirname, "assets/img")));
app.use("/js", express.static(path.join(__dirname, "assets/js")));

// init router
app.use("/", route);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(
    `server is running on ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
