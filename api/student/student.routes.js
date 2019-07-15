const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');
const checkPermission = require('./../../helper/CheckPermission');

//buy Course
// router.get('/buy-course/:id', checkPermission.student, StudentController.buyCourse);

router.put('/buy-course/:id', checkPermission.isStudent, StudentController.buyCourse);

router.put('/quiz/:id', checkPermission.isStudent, StudentController.answerQuestion);


module.exports = router;