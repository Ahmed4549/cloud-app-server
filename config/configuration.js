const mongoose = require("mongoose");

function initialize(env) {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Database is connected!");
  });
  return db;
}

module.exports = {
  initialize,
};
