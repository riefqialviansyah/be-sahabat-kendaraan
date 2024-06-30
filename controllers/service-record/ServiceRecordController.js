const { ServiceRecord, Vehicle } = require("../../models");

class ServiceRecordController {
  static async add(req, res, next) {
    try {
      const {
        VehicleId,
        serviceDate,
        mileage,
        totalCost,
        note,
        ServiceLocationId,
      } = req.body;

      const newServiceRecord = await ServiceRecord.create({
        VehicleId,
        serviceDate: new Date(serviceDate),
        mileage,
        totalCost,
        note,
        ServiceLocationId,
      });

      res.status(201).json({
        message: "Success add service record",
        data: newServiceRecord,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const VehicleId = req.params.vehicleId;
      const UserId = req.user.id;

      const vehicle = await Vehicle.findOne({
        where: { id: VehicleId, isDelete: false },
      });

      if (!vehicle || vehicle.UserId !== UserId) {
        throw {
          name: "NotFound",
          message: "Vehicle not found and dont have service record",
        };
      }

      const serviceRecords = await ServiceRecord.findAll({
        where: { VehicleId, isDelete: false },
      });

      res
        .status(200)
        .json({ message: "All service record", data: serviceRecords });
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    try {
      const { vehicleId, serviceId } = req.params;

      const vehicle = await Vehicle.findOne({
        where: { id: vehicleId, isDelete: false },
      });

      if (!vehicle) {
        throw {
          name: "NotFound",
          message: "Vehicle not found",
        };
      }

      const serviceRecord = await ServiceRecord.findOne({
        where: { id: serviceId, isDelete: false },
      });

      if (!serviceRecord) {
        throw {
          name: "NotFound",
          message: "Service record not found",
        };
      }

      res.status(200).json({ message: "Service record", data: serviceRecord });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { serviceId } = req.params;
      const { serviceDate, mileage, totalCost, note, ServiceLocationId } =
        req.body;

      const serviceRecord = await ServiceRecord.findOne({
        where: { id: serviceId, isDelete: false },
        include: {
          model: Vehicle,
        },
      });

      if (!serviceRecord) {
        throw {
          name: "NotFound",
          message: "Service record not found",
        };
      }

      if (serviceRecord.Vehicle.isDelete) {
        throw {
          name: "NotFound",
          message: "Vehicle not found",
        };
      }

      serviceRecord.serviceDate = serviceDate;
      serviceRecord.mileage = mileage;
      serviceRecord.totalCost = totalCost;
      serviceRecord.note = note;
      serviceRecord.ServiceLocationId = ServiceLocationId;

      await serviceRecord.save();

      res.status(200).json({
        message: "Success update service record",
        data: serviceRecord,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { serviceId } = req.params;

      const serviceRecord = await ServiceRecord.findOne({
        where: { id: serviceId, isDelete: false },
        include: { model: Vehicle },
      });

      if (!serviceRecord) {
        throw {
          name: "NotFound",
          message: "Service record not found",
        };
      }

      if (serviceRecord.Vehicle.isDelete) {
        throw {
          name: "NotFound",
          message: "Vehicle not found",
        };
      }

      serviceRecord.isDelete = true;
      await serviceRecord.save();

      res.status(200).json({
        message: "Success delete service record",
        data: serviceRecord,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceRecordController;
