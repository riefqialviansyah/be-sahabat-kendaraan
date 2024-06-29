'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceRecord.init({
    VehicleId: DataTypes.INTEGER,
    serviceDate: DataTypes.DATE,
    mileage: DataTypes.INTEGER,
    totalCost: DataTypes.INTEGER,
    ServiceLocationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ServiceRecord',
  });
  return ServiceRecord;
};