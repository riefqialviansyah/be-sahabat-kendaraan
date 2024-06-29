if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use(require("./routes"));

// middleware error handler
app.use(require("./middlewares/errHandler"));

module.exports = app;
