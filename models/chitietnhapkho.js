'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chitietnhapkho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chitietnhapkho.init({
    id_phieunhap: DataTypes.STRING,
    id_vattu: DataTypes.STRING,
    sl_vattu: DataTypes.STRING,
    id_kho: DataTypes.STRING,
    id_lydo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chitietnhapkho',
  });
  return Chitietnhapkho;
};