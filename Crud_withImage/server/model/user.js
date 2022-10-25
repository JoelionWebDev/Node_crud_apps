const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    requried: true,
  },
  phone: {
    type: String,
    requried: true,
  },
  image: {
    type: String,
    requried: true,
  },
  created: {
    type: Date,
    requried: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
