var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let UserController = require('./users.controller');
const checkPermission = require('./../../helper/CheckPermission');

router.get('/logout', passport.authenticate('jwt', { session: false}), UserController.LogOut);

router.post('/signup', UserController.SignUp );

router.post('/signin', UserController.SignIn);

//TODO: check id unique
router.get("/uscheck/:username",UserController.usCheck);

router.post('/forgot-password/', UserController.forgotPassword);

router.post('/reset-password/:token', UserController.resetPassword);

router.get('/recharge/:idStudent', checkPermission.isAdmin, UserController.recharge);

router.get('/withdrawal/:idTeacher', UserController.withdrawal);

router.post('/change-password', UserController.changePassword);

module.exports = router;
