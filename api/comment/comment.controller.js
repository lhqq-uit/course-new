const User = require('./../users/users.model')
const Comment = require('./comment.model')
const Lesson = require('./../users/lesson.model')

module.exports = {
    create: async (req, res) => {
        //TODO: Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            });
        }

        //TODO: Create a Comment
        try {
            let newComment = {
                time: Date.now(),
                content: req.body.content
            }
            let comment = await Comment.create(newComment);

            await User.findOneAndUpdate({
                user: req.user.data._id
            })

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
            });
        }
    },
    update: async (res, req) => {
        //TODO: Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            });
        }
        //TODO: Create a Comment
        try {
            let update = JSON.parse(req.body.content);
            Comment.findByIdAndUpdate(req.params.idComment, update, (err, result) => {
                if (err) {
                    error.message || "Some error occurred while creating the Comment."
                }
                resres.status(201).json({
                    success: true,
                    msg: "Success create a Comment",
                    data: result
                })
            });
        } catch (error) { //TODO: Show error
            res.status(500).send({
                message: error.message || "Some error occurred while creating the Comment."
            });
        }
    }
}