var mongoose = require("mongoose")

var QuizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  question: {
    type: String,
    required: 'Question is required'
  },
  list_answer: {
    type: [String],
    required: 'Answer is required'
  },
  result: {
    type: String,
    required: 'Result is required'
  }
})

module.exports = mongoose.model('Quiz', QuizSchema);
