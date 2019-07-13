var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
   name: {
      type: String, 
      required: true
   },
   topic: String,
   description: String,
   price: Number,
   total_time: String,
   level: {
      type: String,
      enum: ['Beginner', 'Medium', 'Hard', 'Advanced'],
      default: 'Beginner'
   },
   ratings: {
      type: Number,
      default: 0
   },
   students_enrolled: {
      type: Number,
      default: 0
   },

   // number_lession:{ 
   //    type: Number,
   //    default: 0
   // },
   avatar: String,
   sale: {
      type: Boolean,   //one image
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
