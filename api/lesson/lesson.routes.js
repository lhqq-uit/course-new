const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');

router.post('/:idCourse/',  passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, lessonController.create);

module.exports = router;