var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required!'
  },
  topic: {
    type: String,
    required: 'Topic is required!'
  },
  description: {
    type: String,
    required: 'Description is required!'
  },
  price: {
    type: Number,
    required: 'Price is required!',
  },
  total_time: {
    type: Number,
    // required: 'Total time is required!'
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Medium', 'Hard', 'Advanced'],
    default: 'Beginner',
  },
  ratings: [{
    type: Number,
    min: 1,
    max: 5
  }],
  students_enrolled: {
    type: Number,
    default: 0
  },
  tag: [{
    type: String,
  }],
  avatar: String,   //one image
  sale: {
    type: Number,
    default: 0
  },
  last_update: {
    type: Date,
    default: Date.now
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
});

module.exports = mongoose.model('Course', CourseSchema);
