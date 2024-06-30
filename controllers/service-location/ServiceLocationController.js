const { ServiceLocation } = require("../../models");

class ServiceLocationController {
  static async add(req, res, next) {
    try {
      const UserId = req.user.id;
      const roleAdd = req.user.role;
      const { name, address, city, state, zipCode, description } = req.body;

      const newServiceLocation = await ServiceLocation.create({
        name,
        address,
        city,
        state,
        zipCode,
        description,
        UserId,
        roleAdd,
      });

      res.status(201).json({
        message: "Success add service location",
        data: newServiceLocation,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    const serviceLocations = await ServiceLocation.findAll();

    res.status(200).json({
      message: "Success get all service locations",
      data: serviceLocations,
    });
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, address, city, state, zipCode, description } = req.body;
      const serviceLocation = await ServiceLocation.findByPk(id);

      if (!serviceLocation) {
        return res.status(404).json({ message: "Service location not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== serviceLocation.UserId) {
        throw { name: "Unauthorized", message: "You are not authorized" };
      }

      await serviceLocation.update({
        name,
        address,
        city,
        state,
        zipCode,
        description,
      });

      res.status(200).json({
        message: "Success update service location",
        data: serviceLocation,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceLocationController;
