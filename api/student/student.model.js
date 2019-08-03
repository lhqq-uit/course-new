var mongoose = require("mongoose");

var StudentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  balance: {
    type: Number,
    default: 0
  },
  courses: [{
    id_course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    lesson_number: []
  }],
  course_studied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  iq: [{
    value: Number,
    date: Date
  }],
  quiz_true: [{
    lesson: String,
    id: String
  }]
})

module.exports = mongoose.model('Student', StudentSchema);
