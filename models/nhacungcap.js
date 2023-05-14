'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nhacungcap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Nhacungcap.init({
    ma_nhacc: DataTypes.STRING,
    ten_nhacc: DataTypes.STRING,
    diachi_nhacc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nhacungcap',
  });
  return Nhacungcap;
};