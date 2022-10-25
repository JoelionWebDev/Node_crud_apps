const axios = require("axios");

exports.homeRoute = (req, res) => {
  axios
    .get("http://localhost:5000/api/users")
    .then((response) => {
      res.render("index", { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update = (req, res) => {
  axios.get('http://localhost:5000/api/users',{params:{id:req.query.id}})
  .then((userdata) => {
    res.render("update", { user: userdata.data });
  })
  .catch((err) => {
    res.send(err);
  }); 
};
