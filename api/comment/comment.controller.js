//const User = require('./../users/users.model')
const Comment = require('./comment.model')
const Lesson = require('./../lesson/lesson.model')

module.exports = {
    // ? Parent 
    create: async (req, res) => {
        //TODO: Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            })
        }

        //TODO: Create a Comment
        try {
            let newComment = {
                time: Date.now(),
                content: req.body.content,
                user: req.user.data._id
            }
            let comment = await Comment.create(newComment)


            await Lesson.findOneAndUpdate({
                _id: req.params.idLesson
            }, {
                $push: {
                    comment: comment._id
                }
            })

            res.status(201).json({
                success: true,
                msg: "Success create a Comment",
                data: comment
            })
        } catch (error) { //TODO: Show error
            res.status(500).send({
                message: error.message || "Some error occurred while creating the Comment."
            })
        }
    },
    delete: async (res, req) => {
        try {
            await Lesson.update({
                _id: req.params.idLesson
            }, {
                $pull: {
                    comment: req.params.idComment
                }
            }, {
                multi: true
            });
            let getData = await Comment.findById(
                req.params.idComment
            ).select("reply");

            await Comment.remove({
                '_id': {
                    '$in': getData
                }
            }, (err, result) => {
                if (err) {
                    err.message || "Some thing err"
                }
                res.status(201).json({
                    success: true,
                    msg: "Success delete a Comment",
                    data: result
                })
            })

        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while deleting the Comment."
            })
        }
    },
    update: async (res, req) => {
        //TODO: Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            })
        }
        //TODO: Create a Comment
        try {
            let check = await Comment.findOneAndUpdate({
                _id: req.params.idComment,
                user: req.user.data._id
            }, {
                content: req.body.content
            });
            if (!check) {
                return res.status(404).json({
                    message: "You not a author or Comment not find"
                })
            }
            res.status(201).json({
                success: true,
                msg: "Success update a Comment",
                data: result
            });
        } catch (error) { //TODO: Show error
            res.status(500).send({
                message: error.message || "Some error occurred while updating the Comment."
            })
        }
    },
    createChild: async (res, req) => {
        //TODO: Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            })
        }
        //TODO: Create a Comment
        try {
            let newComment = {
                time: Date.now(),
                content: req.body.content,
                user: req.user.data._id
            }
            let comment = await Comment.create(newComment);

            await Comment.findOneAndUpdate({
                _id: req.params.idCommentParent
            }, {
                $push: {
                    comment: comment._id
                }
            })

            res.status(201).json({
                success: true,
                msg: "Success create a Comment Child",
                data: comment
            })
        } catch (error) { //TODO: Show error
            res.status(500).send({
                message: error.message || "Some error occurred while creating the Comment Child."
            })
        }
    },
    deleteChild: async (res, req) => {
        try {
            await Comment.update({
                _id: req.params.idCommentParent
            }, {
                $pull: {
                    reply: req.params.idCommentChild
                }
            }, {
                multi: true
            });
            await Comment.findByIdAndDelete({
                _id: req.params.idCommentChild
            })
            res.status(201).json({
                success: true,
                msg: "Success delete a comment child",
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while Deleting the Comment Child."
            })
        }
    },
    getOneComment: async (res, req) => {
        try {
            let oneComment = await Comment.findById(req.params.idComment);
            res.status(201).json({
                success: true,
                msg: oneComment,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while get the comment."
            })
        }
    },
    getOneComment: async (res, req) => {
        try {
            let allComment = await Comment.find();
            res.status(201).json({
                success: true,
                msg: allComment,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while get all the comment."
            })
        }
    }
}