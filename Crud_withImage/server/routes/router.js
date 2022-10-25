const express = require("express");
const router = express.Router();
const User = require("../model/user");
const multer = require("multer");
const user = require("../model/user");
const fs = require("fs");

//image upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
let upload = multer({
  storage: storage,
}).single("image");
//inser a user into database route
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  user.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    }
  });
});

//get all users route
router.get("/", (req, res) => {
  user.find().exec((err, users) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", {
        title: "Home Page",
        users: users,
      });
      //res.send(users);
    }
  });
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

//Edit a user route
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  user.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_user", {
          title: "Edit User",
          user: user,
        });
      }
    }
  });
});

//Udate user route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  user.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: `User@- "${req.body.name}" updated successfully`,
        };
        res.redirect("/");
        //res.send(result);
      }
    }
  );
});

//Delete user route
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  user.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "success",
        message: `User Deleted successfully`,
      };
    }
    res.redirect("/");
  });
});

module.exports = router;
