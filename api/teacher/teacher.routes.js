var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let TeacherController = require('./teacher.controller');
let Check = require("../../helper/CheckPermission");

router.post('/register',passport.authenticate('jwt', { session: false}), Check.isAdmin, TeacherController.Register);

// router.get('/logout', passport.authenticate('jwt', { session: false}), TeacherController);

module.exports = router;
