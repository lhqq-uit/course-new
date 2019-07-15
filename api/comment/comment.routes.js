const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const CommentController = require('./comment.controller');
const checkPermission = require('../../helper/CheckPermission');

//TODO: get cmt
//TODO: get all
router.get("/", CommentController.getAllComment);

//TODO: get one
router.get("/:idComment", CommentController.getOneComment);

//TODO: thêm, xóa, cập nhập, cmt chính
//TODO: create cmt
router.post('/:idLesson', passport.authenticate('jwt', {
    session: false
}), checkPermission.isStudent, CommentController.create);

//TODO: delete cmt, khi xóa cmt chính, xóa cả cmt con,
router.delete("/:idLesson/:idComment", passport.authenticate('jwt', {
    session: false
}), checkPermission.isStudent, CommentController.delete);

//TODO: update cmt, for both parent and child
router.put("/:idComment", passport.authenticate('jwt', {
    session: false
}), checkPermission.isStudent, CommentController.update);


//TODO: thêm,xóa, comment child (reply)
//TODO: create cmt child
router.post("/child/:idCommentParent", passport.authenticate('jwt', {
    session: false
}), checkPermission.isStudent, CommentController.createChild);

//TODO: delete cmt child (reply)
router.delete("/child/:idCommentParent/:idCommentChild", passport.authenticate('jwt', {
    session: false
}), checkPermission.isStudent, CommentController.deleteChild);


module.exports = router;