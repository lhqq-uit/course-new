var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let CourseController = require('./course.controller');

//laays danh sach tat ca khoa hoc
router.get("/", passport.authenticate('jwt', { session: false}),CourseController.getAllCourse);

module.exports = router;
