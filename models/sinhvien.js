'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sinhvien extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       
      this.belongsTo(models.Lophoc,
        { 
          targetKey:'ma_lop',
          foreignKey:'ma_lop',               
        
      })
     
     
    }
  }
  Sinhvien.init({
    ma_sv: DataTypes.STRING,
    ten_sv: DataTypes.STRING,
    ngaysinh_sv: DataTypes.DATE,
    gioitinh_sv: DataTypes.BOOLEAN,
    diachi_sv: DataTypes.STRING,
    sdt_sv: DataTypes.STRING,
    ma_lop: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sinhvien',
  });
  return Sinhvien;

};
