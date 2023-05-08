'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sinhviens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_sv: {
        type: Sequelize.STRING
      },
      ten_sv: {
        type: Sequelize.STRING
      },
      ngaysinh_sv: {
        type: Sequelize.DATE
      },
      gioitinh_sv: {
        type: Sequelize.BOOLEAN
      },
      diachi_sv: {
        type: Sequelize.STRING
      },
      sdt_sv: {
        type: Sequelize.STRING
      },
      ma_lop: {
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
    await queryInterface.dropTable('Sinhviens');
  }
};