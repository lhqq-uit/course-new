var mongoose = require('mongoose')

var LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    title: {
      type: String,
      required: 'Title is required!'
    },
    desciption: {
      type: String,
      required: 'Description is required!',
    },
    video: String,
    document: {
      type: [String]
    },
    quizzes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    }],
    comment: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  }
)
module.exports = mongoose.model('Lesson', LessonSchema);

