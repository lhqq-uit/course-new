const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
let CommentController = require('./comment.controller');
//const checkPermission = require('../../helper/CheckPermission');


//TODO: thêm, xóa, cập nhập, cmt chính
//TODO: create cmt
router.post('/:idLesson', passport.authenticate('jwt', {
    session: false
}), CommentController.create);

//TODO: delete cmt, khi xóa cmt chính, xóa cả cmt con, cái này chưa làm
router.delete("/:idComment", passport.authenticate('jwt', {
    session: false
}), CommentController.delete)

//TODO: update cmt, for both parent and child
router.put("/:idComment", passport.authenticate('jwt', {
    session: false
}), CommentController.update)


//TODO: thêm,xóa, comment child (reply)
//TODO: create cmt child
router.post("/:idCommentParent", passport.authenticate('jwt', {
    session: false
}), CommentController.createChild);

module.exports = router;