const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
let CommentController = require('./comment.controller');
//const checkPermission = require('../../helper/CheckPermission');

router.post('/:idLesson',  passport.authenticate('jwt', { session: false}), CommentController.create);

module.exports = router;