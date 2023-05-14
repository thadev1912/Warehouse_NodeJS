'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phieuxuatkho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Phieuxuatkho.init({
    ma_phieu: DataTypes.STRING,
    id_thukho: DataTypes.STRING,
    id_nhanvien: DataTypes.STRING,
    id_lydo: DataTypes.STRING,
    ngayxuat: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Phieuxuatkho',
  });
  return Phieuxuatkho;
};