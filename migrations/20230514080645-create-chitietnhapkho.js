'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chitietnhapkhos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_phieunhap: {
        type: Sequelize.STRING
      },
      id_vattu: {
        type: Sequelize.STRING
      },
      sl_vattu: {
        type: Sequelize.STRING
      },
      id_kho: {
        type: Sequelize.STRING
      },
      id_lydo: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Chitietnhapkhos');
  }
};