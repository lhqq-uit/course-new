var mongoose = require("mongoose")

var CommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  time: {
    type: Date,
    default: Date.now()
  },
  content: {
    type: String,
    required: 'Content is required!',
  },
  reply: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('Comment', CommentSchema);
