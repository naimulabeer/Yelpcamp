const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const User = require('../models/user')
const passport = require('passport')
const isLoggedIn = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get(users.regUser)
    .post(catchAsync(users.newUser))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), users.login)


router.get('/logout', users.logout)


module.exports = router