const { Vehicle } = require("../../models");

class VehicleController {
  static async add(req, res, next) {
    try {
      const UserId = req.user.id;
      const { merk, CategoryId, year, regNumber, ownerName } = req.body;

      const newVechicle = await Vehicle.create({
        UserId,
        merk,
        CategoryId,
        year,
        regNumber,
        ownerName,
      });

      res.status(201).json({
        message: "Success add vehicle",
        data: newVechicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const UserId = req.user.id;
    const vehicles = await Vehicle.findAll({
      where: { UserId, isDelete: false },
    });

    res.status(200).json({
      message: "Success get all vehicles",
      data: vehicles,
    });
  }

  static async getById(req, res, next) {
    try {
      const UserId = req.user.id;
      const { id } = req.params;

      const vehicle = await Vehicle.findOne({
        where: { id, UserId, isDelete: false },
      });

      if (!vehicle) {
        throw { name: "NotFound", message: "Vehicle not found" };
      }

      res.status(200).json({
        message: "Success get vehicle",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const UserId = req.user.id;
      const { id } = req.params;
      const { merk, CategoryId, year, regNumber, ownerName } = req.body;

      const vehicle = await Vehicle.findOne({
        where: { id, UserId },
      });

      if (!vehicle) {
        throw { name: "NotFound", message: "Vehicle not found" };
      }

      await vehicle.update({
        merk,
        CategoryId,
        year,
        regNumber,
        ownerName,
      });

      res.status(200).json({
        message: "Success update vehicle",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const UserId = req.user.id;
      const { id } = req.params;

      const vehicle = await Vehicle.findOne({
        where: { id, UserId },
      });

      if (!vehicle) {
        throw { name: "NotFound", message: "Vehicle not found" };
      }

      await vehicle.update({ isDelete: true });

      res.status(200).json({
        message: "Success delete vehicle",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;
