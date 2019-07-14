const User = require('./../users/users.model')
const Comment = require('./comment.model')

module.exports = {
    create: async (req, res) => {
        // ! Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Comment can not be empty"
            });
        }

        // ! Create a Comment
        try {
            let newComment = {
                time: Date.now(),
                content: req.body.content
            }
            let comment = await Comment.create(newComment);

            await User.findOneAndUpdate({
                user: req.user.data._id
            })

            res.status(201).json({
                success: true,
                msg: "Success create a Comment",
                data: comment
            })
        } catch (error) { // ? show error
            res.status(500).send({
                message: error.message || "Some error occurred while creating the Comment."
            });
        }
    }
}