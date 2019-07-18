const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');
const checkPermission = require('./../../helper/CheckPermission');

router.get('/info/:idStudent', StudentController.getStudent);

router.get('/courses-purchased',checkPermission.isStudent, StudentController.getAllCoursePurchased);

router.get('/courses-not-purchased', StudentController.getAllCourseNotPurchased);

router.put('/buy-course/:idCourse', checkPermission.isStudent, StudentController.buyCourse);

router.put('/quiz/:idQuiz', checkPermission.isStudent, StudentController.answerQuestion);

router.put('/:idCourse/:idLesson', checkPermission.isStudent, StudentController.setLessonStudied);

module.exports = router;