'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vehicle.init({
    UserId: DataTypes.INTEGER,
    merk: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    year: DataTypes.DATE,
    regNumber: DataTypes.STRING,
    ownerName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};