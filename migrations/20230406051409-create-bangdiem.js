'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bangdiems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kiemtra_mieng: {
        type: Sequelize.INTEGER
      },
      kiemtra15p_lan1: {
        type: Sequelize.INTEGER
      },
      kiemtra15p_lan2: {
        type: Sequelize.INTEGER
      },
      kiemtra_30p: {
        type: Sequelize.INTEGER
      },
      kiemtra_45p: {
        type: Sequelize.INTEGER
      },
      diem_thi: {
        type: Sequelize.INTEGER
      },
      tb_mon: {
        type: Sequelize.INTEGER
      },
      id_monhoc: {
        type: Sequelize.STRING
      },
      id_sinhvien: {
        type: Sequelize.STRING
      },
      id_giaovien: {
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
    await queryInterface.dropTable('Bangdiems');
  }
};