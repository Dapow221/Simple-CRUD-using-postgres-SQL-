'use strict';
const formatRupiah = require('../helper/helper')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Store)
    }

    static filterEmployee(position, Store) {
      const option = {
        include: [Store],
            order : [[
                "firstName", "ASC"
            ]],
            where : {
              position : position
            }
      }
      return Employee.findAll(option)
    }

    get dateFormat() {
      return this.dateOfBirth.toISOString().split('T')[0]
    }

    get age() {
      const yearToday = new Date().getFullYear()
      const birthYear = this.dateOfBirth.getFullYear()
      return yearToday - birthYear
    }

    get formatRupiahModel() {
      return formatRupiah(this.salary)
    }

  }
  Employee.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First Name is required'
        },
        notEmpty: {
          msg: 'First Name is required'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name is required'
        },
        notEmpty: {
          msg: 'Last Name is required'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date is required'
        },
        notEmpty: {
          msg: 'Date is required'
        },
        minimAge(value){
          if(value !== ""){
            if(new Date().getFullYear() - value.getFullYear() < 17){
              throw new Error('Your age is under 17')
            }
          }
        }
      }
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Education is required'
        },
        notEmpty: {
          msg: 'Education is required'
        }
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Position is required'
        },
        notEmpty: {
          msg: 'Position is required'
        },
        isValidPosition(value) {
          const validPositions = ['Manager', 'CEO']
          if (!validPositions.includes(value) && (this.education === 'S2' || this.education === 'S3')) {
            throw new Error('Invalid position. Only Manager or CEO allowed for S2 or S3 education.')
          }
        }
      }
    },
    StoreId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Store is required'
        },
        notEmpty: {
          msg: 'Store is required'
        }
      }
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Salary is required'
        },
        notEmpty: {
          msg: 'Salary is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};

