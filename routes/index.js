const express = require('express')
const router = express.Router()
const storeRouter = require('./store')
const employeeRouter = require('./employee')
const Controller = require('../controllers/controller')

router.get('/register', Controller.registerform)
router.post('/register', Controller.postregister)
router.get('/login', Controller.loginform)
router.post('/login', Controller.postlogin)
router.get('/logout', Controller.logout)
router.get('/profile', Controller.profilepage)

router.use(function (req, res, next) {
    console.log(req.session)
    if (!req.session.userId) {
        const error = "please login first"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
    
})

router.use(function (req, res, next) {
    console.log(req.session)
    if (req.session.userId && req.session.role !== 'admin') {
        const error = "you have no acces"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
    
})

router.get('/', Controller.homePage)
router.use('/employees', employeeRouter)
router.use('/stores', storeRouter)

module.exports = router