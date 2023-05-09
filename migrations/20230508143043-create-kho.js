'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Khos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_kho: {
        type: Sequelize.STRING
      },
      ten_kho: {
        type: Sequelize.STRING
      },
      dia_chi: {
        type: Sequelize.STRING
      },
      sdt: {
        type: Sequelize.STRING
      },
      ghi_chu: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Khos');
  }
};