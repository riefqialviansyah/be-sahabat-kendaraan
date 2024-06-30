const express = require("express");
const router = express.Router();

const ServiceLocationController = require("../controllers/service-location/ServiceLocationController");

router.get("/", ServiceLocationController.get);
router.post("/", ServiceLocationController.add);
router.put("/:id", ServiceLocationController.update);

module.exports = router;
