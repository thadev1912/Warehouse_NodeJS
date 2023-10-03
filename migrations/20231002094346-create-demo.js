'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Demos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      production_required_id: {
        type: Sequelize.STRING
      },
      production_required_create: {
        type: Sequelize.STRING
      },
      production_required_order: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING
      },
      production_required_note: {
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
    await queryInterface.dropTable('Demos');
  }
};