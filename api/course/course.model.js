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
   ratings: {
      type: Number,
      default: 0
   },
   students_enrolled: {
      type: Number,
      default: 0
   },
   avatar: String,   //one image
   sale: {
      type: Boolean,   
      default: false
   },
   last_update:{
      type: Date,
      default: Date.now
   },
   teacher:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
   },
   lessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
   }]
});

module.exports = mongoose.model('Course', CourseSchema);
