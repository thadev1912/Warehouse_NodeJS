'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phieunhapkho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Phieunhapkho.init({
    ma_phieu: DataTypes.STRING,
    id_nhanvien: DataTypes.STRING,
    id_kho: DataTypes.STRING,
    id_nhacc: DataTypes.STRING,
    id_lydo: DataTypes.STRING,
    ngaynhap: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Phieunhapkho',
  });
  return Phieunhapkho;
};