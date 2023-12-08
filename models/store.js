'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.hasMany(models.Employee)
    }
  }
  Store.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    location: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
  });
  Store.beforeCreate((store, options) => {
    if (store.category === 'Mart') {
      store.code = '001-' + new Date().getTime()
    } else if (store.category === 'Midi') {
      store.code = '002-' + new Date().getTime()
    } else if (store.category === 'Express') {
      store.code = '003-' + new Date().getTime()
    }
  })

  return Store;
};