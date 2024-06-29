const express = require("express");
const router = express.Router();
const os = require("os");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to my API",
    github: "https://github.com/riefqialviansyah",
    os: os.platform(),
  });
});

router.use("/user", require("./userRoute"));

module.exports = router;
