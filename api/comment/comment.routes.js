const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
let CommentController = require('./comment.controller');
//const checkPermission = require('../../helper/CheckPermission');

//TODO: create cmt
router.post('/:idLesson', passport.authenticate('jwt', {
    session: false
}), CommentController.create);

//TODO: update cmt
router.put("/:idComment", passport.authenticate('jwt', {
    session: false
}), CommentController.update)

module.exports = router;