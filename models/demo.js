'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Demo.init({
    production_required_id: DataTypes.STRING,
    production_required_create: DataTypes.STRING,
    production_required_order: DataTypes.STRING,
    user_id: DataTypes.STRING,
    production_required_note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Demo',
  });
  return Demo;
};