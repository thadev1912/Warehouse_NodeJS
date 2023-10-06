'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
    }
  }
  Role_Permission.init({
    id_role: DataTypes.STRING,
    id_permission: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role_Permission',
  });
  return Role_Permission;
};