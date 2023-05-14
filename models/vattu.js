'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vattu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vattu.init({
    ma_vattu: DataTypes.STRING,
    ten_vattu: DataTypes.STRING,
    donvitinh: DataTypes.STRING,
    soluong: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vattu',
  });
  return Vattu;
};