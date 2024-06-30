"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.hasMany(models.ServiceRecord, { foreignKey: "VehicleId" });
    }
  }
  Vehicle.init(
    {
      UserId: DataTypes.INTEGER,
      merk: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Merk is required",
          },
          notEmpty: {
            msg: "Merk is required",
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Category is required",
          },
          notEmpty: {
            msg: "Category is required",
          },
        },
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Year is required",
          },
          notEmpty: {
            msg: "Year is required",
          },
        },
      },
      regNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Registration number is required",
          },
          notEmpty: {
            msg: "Registration number is required",
          },
        },
      },
      ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Owner name is required",
          },
          notEmpty: {
            msg: "Owner name is required",
          },
        },
      },
      isDelete: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Vehicle",
    }
  );
  return Vehicle;
};
