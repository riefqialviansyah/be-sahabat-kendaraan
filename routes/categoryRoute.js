const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/category/CategoryController");

router.get("/", CategoryController.get);
router.post("/", CategoryController.add);
router.put("/:id", CategoryController.update);

module.exports = router;
