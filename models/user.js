const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    organization: String,
    phone: Number,
  },
  { versionKey: false, timestamps: true }
);

var UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
