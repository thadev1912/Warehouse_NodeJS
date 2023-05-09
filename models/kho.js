'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kho.init({
    ma_kho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ten_kho:{
     type: DataTypes.STRING,
     allowNull: false,
    },
    dia_chi: {
     type: DataTypes.STRING,
     allowNull: false,
    },
    sdt:{
    type:  DataTypes.STRING,
    allowNull:false,
    },
    ghi_chu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Kho',
  });
  return Kho;
};