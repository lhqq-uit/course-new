const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const CourseController = require('./course.controller');
const multer = require('multer')
const checkPermission = require('./../../helper/CheckPermission');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './../public/upload')
   },
   filename: function (req, file, cb) {
     cb(null, Date.now() + '_' + file.originalname);
   }
 });
 
 var upload = multer({ storage: storage });
//laays danh sach tat ca khoa hoc
router.get("/", passport.authenticate('jwt', { session: false}),CourseController.getAllCourse);

router.post('/', upload.single('image'), checkPermission.isTeacher, CourseController.Create);
module.exports = router;
