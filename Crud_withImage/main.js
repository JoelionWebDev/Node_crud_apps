require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

//init express
const app = express();
//set port number
const PORT = process.env.PORT || 4000;

//MIDDLE WARES
//bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//session
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

//set static folders
app.use(express.static("uploads"));

//set template engine
app.set("view engine", "ejs");

//routes path MIDDLE WARE (routes prefix)
app.use("", require("./server/routes/router"));

// DATABASE connection
new mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("mongodb is connected"));

app.listen(PORT, () =>
  console.log(`Server started on port : http://localhost:${PORT}`)
);
