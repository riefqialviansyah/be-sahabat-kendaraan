const express = require("express");
const ServiceRecordController = require("../controllers/service-record/ServiceRecordController");
const router = express.Router();

router.post("/", ServiceRecordController.add);
router.get("/:vehicleId", ServiceRecordController.getAll);
router.get("/:vehicleId/:serviceId", ServiceRecordController.getOne);
router.put("/:serviceId", ServiceRecordController.update);
router.delete("/:serviceId", ServiceRecordController.delete);

module.exports = router;
