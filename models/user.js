'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //cách xóa đồng bộ!!!
      // db.coordinator.userProfile = db.coordinator.belongsTo(db.userProfile, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      // }); 
       User.belongsToMany(models.Role, { through: 'User_Role',foreignKey:'id_user' });
       models.Role.belongsToMany(User, { through: 'User_Role',foreignKey:'id_role' });
  
  
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    diachi: DataTypes.STRING,
    sdt: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};