const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const CourseController = require('./course.controller');
const multer = require('multer')
const checkPermission = require('./../../helper/CheckPermission');

var storage = multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    if (file.fieldname == "trailer") {
      callback(null, './public/upload/trailer/');
    } else {
      callback(null, './public/upload/images/');
    }
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage }).fields([
  { name: 'trailer'},
  { name: 'image'}
])

router.get('/populate', CourseController.getCoursePopulate);

//search with name, description, tag, topic
router.get('/search', CourseController.searchCourse);

router.get('/price/:idCourse', CourseController.getPriceAfterSale);

router.get('/:idCourse', CourseController.getOneCourse);

router.get('/rating/:idCourse', CourseController.getRatingCourse);

router.get('/', CourseController.getAllCourse);

router.post('/', checkPermission.isTeacher, upload, CourseController.create);

router.put('/:idCourse', checkPermission.isTeacher, upload, CourseController.update);

router.put('/rating/:idCourse', checkPermission.isStudent, CourseController.ratingCourse);

router.delete('/:idCourse', checkPermission.isTeacher, CourseController.delete);

module.exports = router;
