'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(value, options) {
        // console.log(value, '<<<< before create')
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(value.password, salt)

        value.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};