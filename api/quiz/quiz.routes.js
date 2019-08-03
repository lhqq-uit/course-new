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
router.get('/', quizController.getAllQuiz);

//create quiz
router.post('/:idLesson/', passport.authenticate('jwt', { session: false }), checkPermission.isTeacher, quizController.create);

//update quiz
router.put('/:idQuiz', passport.authenticate('jwt', { session: false }), checkPermission.isTeacher, quizController.update)

//delete a quiz
router.delete('/:idQuiz', passport.authenticate('jwt', { session: false }), checkPermission.isTeacher, quizController.delete)

module.exports = router;
