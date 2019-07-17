const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');
const checkPermission = require('./../../helper/CheckPermission');

//còn trường hợp khóa học mua rồi thì không mua được nữa
router.put('/buy-course/:idCourse', checkPermission.isStudent, StudentController.buyCourse);

router.put('/quiz/:idQuiz', checkPermission.isStudent, StudentController.answerQuestion);

router.put('/:idCourse/next-lesson', checkPermission.isStudent, StudentController.setLessonStudied);

router.get('/info/:idStudent', StudentController.getStudent);

router.get('/courses-purchased',checkPermission.isStudent, StudentController.getAllCoursePurchased);


//chưa xong
router.get('/courses-not-purchased/:idStudent', StudentController.getAllCourseNotPurchased);
module.exports = router;