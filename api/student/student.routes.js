const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');
const checkPermission = require('./../../helper/CheckPermission');


router.put('/buy-course/:idCourse', checkPermission.isStudent, StudentController.buyCourse);

router.put('/quiz/:idQuiz', checkPermission.isStudent, StudentController.answerQuestion);

router.put('/:idCourse/next-lesson', checkPermission.isStudent, StudentController.setLessonStudied);

router.get('/:idStudent', StudentController.getStudent);
module.exports = router;