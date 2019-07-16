var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let TeacherController = require('./teacher.controller');
let checkPermission = require("../../helper/CheckPermission");

router.get('/transaction/:timedate', checkPermission.isTeacher, TeacherController.getTransactionOneDay);

router.get('/info/:idTeacher', TeacherController.getTeacher)

router.get('/courses/:idTeacher', TeacherController.getAllCoureseOfTeacher)

module.exports = router;
