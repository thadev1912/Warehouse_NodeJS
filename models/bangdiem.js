'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bangdiem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bangdiem.init({
    kiemtra_mieng: DataTypes.INTEGER,
    kiemtra15p_lan1: DataTypes.INTEGER,
    kiemtra15p_lan2: DataTypes.INTEGER,
    kiemtra_30p: DataTypes.INTEGER,
    kiemtra_45p: DataTypes.INTEGER,
    diem_thi: DataTypes.INTEGER,
    tb_mon: DataTypes.INTEGER,
    id_monhoc: DataTypes.STRING,
    id_sinhvien: DataTypes.STRING,
    id_giaovien: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bangdiem',
  });
  return Bangdiem;
};