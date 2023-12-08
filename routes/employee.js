const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.employeeList)
// router.get('/:id/employees/add', Controller.addEmployeePage)

module.exports = router