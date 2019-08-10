const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');

//get a quiz
router.get('/:idQuiz', quizController.getOneQuiz);

//get All quiz
router.get('/allQuiz/:idLesson', quizController.getAllQuiz);

//create quiz
router.post('/:idLesson/', checkPermission.isTeacher, quizController.create);

//update quiz
router.put('/:idQuiz', checkPermission.isTeacher, quizController.update)

//delete a quiz
router.delete('/:idQuiz', checkPermission.isTeacher, quizController.delete)

module.exports = router;
