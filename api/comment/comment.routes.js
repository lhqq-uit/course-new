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

//TODO: get all cmt in lesson
router.get("/lesson/:idLesson", CommentController.getAllCommentOfLesson);

//TODO: thêm, xóa, cập nhập, cmt chính
//TODO: create cmt
router.post('/:idLesson', passport.authenticate('jwt', {
  session: false
}), CommentController.create);

//TODO: delete cmt, khi xóa cmt chính, xóa cả cmt con,
router.delete("/:idLesson/:idComment", passport.authenticate('jwt', {
  session: false
}), CommentController.delete);

//TODO: update cmt, for both parent and child
router.put("/:idComment", passport.authenticate('jwt', {
  session: false
}), CommentController.update);


//TODO: thêm,xóa, comment child (reply)
//TODO: create cmt child
router.post("/child/:idCommentParent", passport.authenticate('jwt', {
  session: false
}), CommentController.createChild);

//TODO: delete cmt child (reply)
router.delete("/child/:idCommentParent/:idCommentChild", passport.authenticate('jwt', {
  session: false
}), CommentController.deleteChild);

//TODO: get all cmt form course by teacher, lấy cmt mới nhất từ khóa học trong lesson của teacher ok
router.get("/teacher/:idUser", passport.authenticate('jwt', {
  session: false
}), CommentController.getAllCommentOfCourseByTeacher);

router.get("/t/:idUser", passport.authenticate('jwt', {
  session: false
}), CommentController.getAllCommentOfCourseByTeacher1);


module.exports = router;
