const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3002;
const userRoutes = require("./routes/user-routes");
const environment = process.env.NODE_ENV || "development";
const config = require("./config/configuration");
config.initialize(environment);
const cors = require("cors");
app.use(express.json({ limit: "50mb", extended: true }));
app.use(cors());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use("/api/user", userRoutes);

app.use(async function (err, req, res, next) {
  console.log(err);
  res.status(200).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening at ${port}`));
