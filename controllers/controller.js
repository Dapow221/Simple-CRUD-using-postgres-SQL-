const { Employee, Store, User } = require('../models/')
const formatRupiah = require('../helper/helper')
const bcrypt = require('bcryptjs')


class Controller {
    static homePage(req, res) {
        res.render('homepage')
    }


    static readstore(req, res) {
        Store.findAll()
         .then(data => {
            res.render('readstore', { data })
         })
         .catch(err => {
            res.send(err);
         }) 
    }

    static addstorepage(req, res) {
        res.render('addstore')
    }

    static storeAdd(req, res) {
        const { name, location, category } = req.body
        Store.create({
            name, location, category
         })
         .then(data => {
            res.redirect('/stores')
         })
         .catch(err => {
            res.send(err)
         })
    }

    static employeeList(req, res) {
        const { position } = req.query
        if (position) {
            Employee.filterEmployee(position, Store)
             .then(data => {
                res.render('listemployee', { data })
             })
             .catch(err => {
                res.send(err)
             })

        } else {
            Employee.findAll({
                include: [Store],
                order : [[
                    "firstName", "ASC"
                ]]
             })
             .then(data => {
                res.render('listemployee', { data })
             })
             .catch(err => {
                res.send(err)
             })

        }
    }

    static detailstore(req, res) {
        const id = +req.params.storeId
        let { name } = req.query
        if (name) {
            name += " removed"
        }
        Store.findByPk(id, {
            include: [Employee]
        })
        .then(data => {
            res.render('detailstore', { data, formatRupiah, name })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static addEmployeePage(req, res) {
        const { err } = req.query
        const id = +req.params.storeId
        Store.findByPk(id)
          .then(data => {
            res.render('addemployee', { data, err })
          })
          .catch(err => {
            res.send(err);
          });
      }


    static addEmployee(req, res) {
        const StoreId = +req.params.storeId
        const { firstName, lastName, dateOfBirth, education, position, salary } = req.body
        Employee.create({
            firstName, lastName, dateOfBirth, education, position, salary, StoreId
        })
        .then(data => {
            res.redirect(`/stores/${StoreId}`)
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError') {
                const errors = err.errors.map(el => el.message)
                res.redirect(`/stores/${StoreId}/employees/add?err=${errors}`)
            } else {
                res.send(err)
            }
        })
    }

    static deleteEmployee(req, res) {
        const id  = +req.params.employeeId
        const storeId = +req.params.storeId
        let dataDelete
        Employee.findByPk(id)
         .then(data => {
            dataDelete = data.firstName + " " + data.lastName
            return Employee.destroy({
                where : {
                    id
                }
            })
        })
         .then(data => {
            res.redirect(`/stores/${storeId}/?name=${dataDelete}`)
         })
         .catch(err => {
            res.send(err)
         })
    }

    static editEmployeePage(req, res) {
        const id = +req.params.employeeId
        const StoreId = +req.params.storeId
        const { err } = req.query
        Employee.findByPk(id)
        .then(data => {
            res.render('editemployee', { data, StoreId, err })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static editEmployee(req, res) {
        const employeeId = +req.params.employeeId
        const StoreId = +req.params.storeId
        const { firstName, lastName, dateOfBirth, education, position, salary } = req.body
        Employee.update({
            firstName, lastName, dateOfBirth, education, position, salary, employeeId
        }, {
            where : {
                id : employeeId
            }
        })
        .then(data => {
            res.redirect(`/stores/${StoreId}`)
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError') {
                const errors = err.errors.map(el => el.message)
                res.redirect(`/stores/${StoreId}/employees/add?err=${errors}`)
            } else {
                res.send(err)
            }
        })
    }

    // get register
    static registerform(req, res) {
        res.render('register')
    }

    // post register
    static postregister(req, res) {
        const { username, password, role } = req.body
        User.create({
            username, password, role
        })
        .then(newUser => {
            res.redirect('/login')
        })
        .catch(err => {
            res.send(err)
        })
    }

    // get login
    static loginform(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    // post login
    static postlogin(req, res) {
        // apakah dari username dan password yang diinput, usernya ada?
        // -- findOne user dari username
        // -- kalo user ada, compare plain password apakah sama dengan hash password (di database)
        // -- kalo gak sama passwordnya, gak boleh masuk ke redirect home atau apalah/keluar error
        // -- kalo passwordnya sesuai, maka berhasil redirect

        const { username, password } = req.body
        User.findOne({
            where: {
                username
            }
        })
        .then(user => {
            if (user) {
                const validPassword = bcrypt.compareSync(password, user.password)
                if (validPassword) {
                    // case user berhasil login

                    req.session.userId = user.id
                    req.session.role = user.role  // set session di login
                    return res.redirect('/')
                } else {
                    const error = "invalid password"
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = "invalid password"
                return res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err => {
            res.send(err)
        })

    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })
    }

    static profilepage(req, res) {
        res.render('profile')
    }


    


}

module.exports = Controller