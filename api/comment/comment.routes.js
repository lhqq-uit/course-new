const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const CommentController = require('./comment.controller');
=======
let CommentController = require('./comment.controller');
>>>>>>> 2f5649b7c8f922230aedbf19e1bafe3ce3812f0f
//const checkPermission = require('../../helper/CheckPermission');

//TODO: get cmt
//TODO: get all
<<<<<<< HEAD
router.get("/", CommentController.getAllComment);

//TODO: get one
router.get("/:idComment", CommentController.getOneComment);
=======
router.get("/", passport.authenticate('jwt', {
    session: false
}), CommentController.getAllComment)

//TODO: get one
router.get("/:idComment", passport.authenticate('jwt', {
    session: false
}), CommentController.getOneComment)
>>>>>>> 2f5649b7c8f922230aedbf19e1bafe3ce3812f0f

//TODO: thêm, xóa, cập nhập, cmt chính
//TODO: create cmt
router.post('/:idLesson', passport.authenticate('jwt', {
    session: false
}), CommentController.create);

//TODO: delete cmt, khi xóa cmt chính, xóa cả cmt con,
router.delete("/:idLesson/:idComment", passport.authenticate('jwt', {
    session: false
<<<<<<< HEAD
}), CommentController.delete);
=======
}), CommentController.delete)
>>>>>>> 2f5649b7c8f922230aedbf19e1bafe3ce3812f0f

//TODO: update cmt, for both parent and child
router.put("/:idComment", passport.authenticate('jwt', {
    session: false
<<<<<<< HEAD
}), CommentController.update);
=======
}), CommentController.update)
>>>>>>> 2f5649b7c8f922230aedbf19e1bafe3ce3812f0f


//TODO: thêm,xóa, comment child (reply)
//TODO: create cmt child
router.post("/:idCommentParent", passport.authenticate('jwt', {
    session: false
}), CommentController.createChild);

//TODO: delete cmt child (reply)
router.post("/:idCommentParent/:idCommentChild", passport.authenticate('jwt', {
    session: false
}), CommentController.deleteChild);
<<<<<<< HEAD


=======
>>>>>>> 2f5649b7c8f922230aedbf19e1bafe3ce3812f0f
module.exports = router;