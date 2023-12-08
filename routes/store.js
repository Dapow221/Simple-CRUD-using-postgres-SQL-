const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.readstore)
router.get('/add', Controller.addstorepage)
router.post('/add', Controller.storeAdd)
router.get('/:storeId', Controller.detailstore)
router.get('/:storeId/employees/add', Controller.addEmployeePage)
router.post('/:storeId/employees/add', Controller.addEmployee)
router.get('/:storeId/employees/:employeeId/delete', Controller.deleteEmployee)
router.get('/:storeId/employees/:employeeId/edit', Controller.editEmployeePage)
router.post('/:storeId/employees/:employeeId/edit', Controller.editEmployee)




module.exports = router