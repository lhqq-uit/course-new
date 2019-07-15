const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const CourseController = require('./course.controller');
const multer = require('multer')
const checkPermission = require('./../../helper/CheckPermission');

var storage =   multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    callback(null, './public/upload/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage});
//laays danh sach tat ca khoa hoc
// router.get("/", passport.authenticate('jwt', { session: false}),CourseController.getAllCourse);
//upload.single('image'), passport.authenticate('jwt', { session: false}), checkPermission.isAdmin,
router.post('/', checkPermission.isTeacher, upload.single('image'), CourseController.create);

router.put('/:id', checkPermission.isTeacher, upload.single('image'), CourseController.update);

router.get('/:id', CourseController.getOneCourse);

router.get('/', CourseController.getAllCourse);

router.delete('/:id', checkPermission.isTeacher, CourseController.delete);

module.exports = router;
