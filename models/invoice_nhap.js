'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice_nhap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice_nhap.init({
    invoice_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invoice_nhap',
  });
  return Invoice_nhap;
};