'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tintucdatxanh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tintucdatxanh.init({
    tieude_baiviet: DataTypes.STRING,
    noidung_baiviet: DataTypes.STRING,
    danhmuc_baiviet: DataTypes.STRING,
    tacgia_baiviet: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tintucdatxanh',
  });
  return Tintucdatxanh;
};