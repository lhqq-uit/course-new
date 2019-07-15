const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');
var storage =   multer.diskStorage({
    // file upload destination
    destination: function (req, file, callback) {
      callback(null, './../public/upload');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  var upload = multer({ storage : storage}).fields([
      {
          name: 'video',
          name: 'document'
      }
  ])

//create lesson
router.post('/:idCourse/',  passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, lessonController.create);

//update lesson
router.put('/:idLesson', passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, lessonController.update);

//get a lesson
router.get('/:idLesson', lessonController.getOneLesson);

//get all lesson
router.get('/',lessonController.getAllLesson);

//delete lesson
router.delete('/:idLesson', passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, lessonController.delete);
module.exports = router;