"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ServiceRecords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      VehicleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Vehicles",
          key: "id",
        },
        allowNull: false,
      },
      serviceDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ServiceLocationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "ServiceLocations",
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ServiceRecords");
  },
};
