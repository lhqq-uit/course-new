const User = require('./../users/users.model')
const Comment = require('./comment.model')

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
    }
}