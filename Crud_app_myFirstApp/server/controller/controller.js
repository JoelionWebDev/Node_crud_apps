const Userdb = require("../model/model");

//CREATE AND SAVE NEW USER
exports.create = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(404).send({ message: "Content can not be empty!" });
  }
  //new users
  const user = new Userdb({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    status: req.body.status,
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
};

//RETRIEVE AND RETURN ALL USERS/ RETRIEVE AND RETURN A SINGLE USER
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Userdb.findById(id)
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({ message: `Not found, make sure the ${id} is correct` });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error retrieving user" + id });
      });
  } else {
    Userdb.find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "error occured while retrieving user information",
        });
      });
  }
};

//Edit a user route
exports.edit = (req, res) => {
  let id = req.params.id;
  Userdb.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("update", {
          title: "Edit User",
          user: user,
        });
      }
    }
  });
};

//UPDATE A NEW IDENTIFIED USER BY USER ID
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.params.id;
  Userdb.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      status: req.body.status,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: `User Updated successfully`,
        };
        res.redirect("/");
      }
    }
  );
};

//DELETE A USER WITH SPECIFIED USER ID IN THE REQUEST
exports.delete = (req, res) => {
  let id = req.params.id;
  Userdb.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      if (err) {
        res.json({ message: err.message });
      } else {
        req.session.message = {
          type: "success",
          message: `User Deleted successfully`,
        };
      }

      res.redirect("/");
    }
  });
};
