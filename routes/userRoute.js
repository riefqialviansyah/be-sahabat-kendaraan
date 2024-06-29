const express = require("express");
const router = express.Router();

// import controller
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
