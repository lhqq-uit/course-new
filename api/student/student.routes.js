const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');
const checkPermission = require('./../../helper/CheckPermission');

router.get('/info/:idStudent', StudentController.getStudent);

router.get('/courses-purchased', checkPermission.isStudent, StudentController.getAllCoursePurchased);

router.get('/courses-not-purchased', checkPermission.isStudent, StudentController.getAllCourseNotPurchased);

router.put('/buy-course/:idCourse', checkPermission.isStudent, StudentController.buyCourse);

router.put('/quiz/:idLesson', checkPermission.isStudent, StudentController.answerQuestion);

router.put('/:idLesson', checkPermission.isStudent, StudentController.setLessonStudied);

router.get('/set-course-studied', checkPermission.isStudent, StudentController.setCourseStudied);

router.get('/total-iq', checkPermission.isStudent, StudentController.getTotalIq);

router.get('/iq-a-week', checkPermission.isStudent, StudentController.getIqAWeek);

router.get('/course-studied', checkPermission.isStudent, StudentController.getCourseStudied);

//this for ejs

router.get('/total-iq/:id', StudentController.getTotalIq1);
router.get('/iq-a-week/:id', StudentController.getIqAWeek1);
router.get('/course-studied/:id', StudentController.getCourseStudied1)



module.exports = router;
