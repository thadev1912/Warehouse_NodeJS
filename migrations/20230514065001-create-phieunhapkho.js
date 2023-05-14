'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Phieunhapkhos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ma_phieu: {
        type: Sequelize.STRING
      },
      id_nhanvien: {
        type: Sequelize.STRING
      },
      id_kho: {
        type: Sequelize.STRING
      },
      id_nhacc: {
        type: Sequelize.STRING
      },
      id_lydo: {
        type: Sequelize.STRING
      },
      ngaynhap: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Phieunhapkhos');
  }
};