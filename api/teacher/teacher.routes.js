var passport = require('passport');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
let TeacherController = require('./teacher.controller');
let Check = require("../../helper/CheckPermission");

module.exports = router;
