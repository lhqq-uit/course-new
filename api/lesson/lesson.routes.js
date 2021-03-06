const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');
var storage = multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    // console.log(file.fieldname)
    if (file.fieldname == "video") {
      callback(null, './public/upload/video/');
    } else {
      callback(null, './public/upload/document/');
    }
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 10 }
])

//get a lesson
router.get('/:idLesson', checkPermission.usedLogin, lessonController.getOneLesson);

//get all lesson
router.get('/', lessonController.getAllLesson);

//create lesson
router.post('/:idCourse/', checkPermission.isTeacher, upload, lessonController.create);

//update lesson
router.put('/:idLesson', checkPermission.isTeacher, upload, lessonController.update);

//delete lesson
router.delete('/:idLesson', checkPermission.isTeacher, lessonController.delete);

module.exports = router;
