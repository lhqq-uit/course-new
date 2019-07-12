var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let UserController = require('./users.controller');

router.post('/signup', UserController.SignUp );

router.post('/signin', UserController.SignIn);

router.get('/logout', passport.authenticate('jwt', { session: false}), UserController.LogOut);

module.exports = router;
