'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tintucdatxanhs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tieude_baiviet: {
        type: Sequelize.STRING
      },
      noidung_baiviet: {
        type: Sequelize.STRING
      },
      danhmuc_baiviet: {
        type: Sequelize.STRING
      },
      tacgia_baiviet: {
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
    await queryInterface.dropTable('Tintucdatxanhs');
  }
};