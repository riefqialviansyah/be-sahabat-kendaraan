"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServiceLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceLocation.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Service location name is require" },
          notEmpty: { msg: "Service location name is require" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Service address is require" },
          notEmpty: { msg: "Service address is require" },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Service city is require" },
          notEmpty: { msg: "Service city is require" },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Service state is require" },
          notEmpty: { msg: "Service state is require" },
        },
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Service zip code is require" },
          notEmpty: { msg: "Service zip code is require" },
        },
      },
      description: DataTypes.TEXT,
      roleAdd: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ServiceLocation",
    }
  );
  return ServiceLocation;
};
