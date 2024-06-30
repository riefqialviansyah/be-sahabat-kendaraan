"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServiceRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ServiceRecord.belongsTo(models.Vehicle, { foreignKey: "VehicleId" });
    }
  }
  ServiceRecord.init(
    {
      VehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Vehicle id is required",
          },
          notEmpty: {
            msg: "Vehicle id is required",
          },
        },
      },
      serviceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service date is required",
          },
          notEmpty: {
            msg: "Service date is required",
          },
        },
      },
      mileage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Mileage is required",
          },
          notEmpty: {
            msg: "Mileage is required",
          },
        },
      },
      totalCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Total cost is required",
          },
          notEmpty: {
            msg: "Total cost is required",
          },
        },
      },
      note: DataTypes.TEXT,
      isDelete: DataTypes.BOOLEAN,
      ServiceLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service location id is required",
          },
          notEmpty: {
            msg: "Service location id is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ServiceRecord",
    }
  );
  return ServiceRecord;
};
