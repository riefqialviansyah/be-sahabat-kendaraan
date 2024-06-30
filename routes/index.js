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

router.use(require("../middlewares/auth"));
router.use("/category", require("./categoryRoute"));
router.use("/service-location", require("./serviceLocationRoute"));
router.use("/vehicle", require("./vehicleRoute"));
router.use("/service-record", require("./serviceRecordRoute"));

module.exports = router;
