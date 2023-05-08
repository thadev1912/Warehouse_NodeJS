'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lophoc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
    }
  }
  Lophoc.init({
    ma_lop: DataTypes.STRING,
    ten_lop: DataTypes.STRING,
    gvcn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lophoc',
  });
  return Lophoc;
};