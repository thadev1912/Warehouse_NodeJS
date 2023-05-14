'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice_xuat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice_xuat.init({
    invoice_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invoice_xuat',
  });
  return Invoice_xuat;
};