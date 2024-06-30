const express = require("express");
const router = express.Router();

const VehicleController = require("../controllers/vehicle/VehicleController");

router.post("/", VehicleController.add);
router.get("/", VehicleController.getAll);
router.get("/:id", VehicleController.getById);
router.put("/:id", VehicleController.update);
router.delete("/:id", VehicleController.delete);

module.exports = router;
