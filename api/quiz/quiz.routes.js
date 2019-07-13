const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');


router.post('/:idLesson/',  passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, quizController.create);

module.exports = router;