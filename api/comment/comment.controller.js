const User = require('./../users/users.model')
const Comment = require('./comment.model')
const Lesson = require('./../lesson/lesson.model')

module.exports = {
    // ? Parent 
    create: async (req, res) => {
        //TODO: Create a Comment
        try {
            //TODO: Validate request
            if (!req.body.content) {
                return res.status(400).send({
                    message: "Comment can not be empty"
                })
            }

            let newComment = {
                user: req.user.data._id,
                time: Date.now(),
                content: req.body.content,
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
                message: error.message || "Some error occurred while creating the Comment.",
                // //iduser: req.user.data._id,
                // idLesson1: req.params.idLesson,
                // content1: req.body.content,
            })
        }
    },
    delete: async (req, res) => {
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
    update: async (req, res) => {
        //TODO: Update a Comment
        try {
            //TODO: Validate request
            if (!req.body.content) {
                return res.status(400).send({
                    message: "Comment can not be empty"
                })
            }
            let result = await Comment.findOneAndUpdate({
                _id: req.params.idComment,
                user: req.user.data._id
            }, {
                content: req.body.content
            });

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
    createChild: async (req, res) => {
        //TODO: Create a Comment
        try {
            //TODO: Validate request
            if (!req.body.content) {
                return res.status(400).send({
                    message: "Comment can not be empty"
                })
            }
            let newComment = {
                user: req.user.data._id,
                time: Date.now(),
                content: req.body.content,
            }
            let comment = await Comment.create(newComment);

            await Comment.findOneAndUpdate({
                _id: req.params.idCommentParent
            }, {
                $push: {
                    reply: comment._id
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
    deleteChild: async (req, res) => {
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
    getOneComment: async (req, res) => {
        try {
            let oneComment = await Comment.findById(req.params.idComment);
            res.status(201).json({
                success: true,
                msg: "Get one comment success",
                data: oneComment,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while get the comment."
            })
        }
    },
    getAllComment: async (_req, res) => {
        try {
            let allComment = await Comment.find();
            res.status(201).json({
                success: true,
                msg: "Get all comment success",
                data: allComment,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while get all the comment."
            })
        }
    }
}