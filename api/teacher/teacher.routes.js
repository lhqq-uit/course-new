var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let TeacherController = require('./teacher.controller');
let checkPermission = require("../../helper/CheckPermission");

router.get('/transaction-this-month', checkPermission.isTeacher, TeacherController.getTransactionThisMonth);

router.get('/transaction-one-week', checkPermission.isTeacher, TeacherController.getTransactionOneWeek);

router.get('/average-salary', checkPermission.isTeacher, TeacherController.getAverageMonthlySalary);
//get info of teacher
//TODO: get teacher information via id user
router.get('/info/:idTeacher', TeacherController.getTeacher)

//get all courses of teacher
router.get('/courses/:idTeacher', TeacherController.getAllCoureseOfTeacher)


//search teacher with fullname
router.get('/', TeacherController.searchTeacher)

module.exports = router;
