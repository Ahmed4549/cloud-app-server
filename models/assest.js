const mongoose = require("mongoose");

var assetSchema = new mongoose.Schema(
  {
    name: String,
    cloud: String,
    risk: String,
    service: String,
    description: String,
    category: String,
    function: String,
    group: String,
    messageFail: String,
    messagePass: String,
    pageDetail: String,
    RemediationSteps: String,
  },
  { versionKey: false, timestamps: true }
);

var UserModel = mongoose.model("Asset", assetSchema);
module.exports = UserModel;
