var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let UserController = require('./users.controller');

router.get('/logout', passport.authenticate('jwt', { session: false}), UserController.LogOut);

router.post('/signup', UserController.SignUp );

router.post('/signin', UserController.SignIn);

router.post('/forgot-password/', UserController.forgotPassword);

router.post('/reset-password/:token', UserController.resetPassword);

module.exports = router;
