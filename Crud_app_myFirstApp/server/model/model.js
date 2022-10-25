const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxLength: [20, "name can not be more than 20 chaeracters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: String,
  status: String,
});

const Userdb = mongoose.model("Userdb", schema);

module.exports = Userdb;
