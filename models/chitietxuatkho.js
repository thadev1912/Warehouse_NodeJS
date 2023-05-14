'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chitietxuatkho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chitietxuatkho.init({
    id_phieuxuat: DataTypes.STRING,
    id_vattu: DataTypes.STRING,
    sl_vattu: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chitietxuatkho',
  });
  return Chitietxuatkho;
};