var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let TeacherController = require('./teacher.controller');
let checkPermission = require("../../helper/CheckPermission");

router.get('/transaction/:timedate', checkPermission.isTeacher, TeacherController.getTransactionOneDay);

router.get('/:idTeacher', TeacherController.getTeacher)

module.exports = router;
