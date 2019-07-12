var mongoose = require('mongoose');

var Course = new mongoose.Schema({
   name: {type: String, required: true},
   topic: String,
   description: String,
   price: Number,
   total_time: String,
   level: {
      type: String,
      enum: ['Beginner', 'Medium', 'Hard', 'Advanced']
   },
   ratings: Number,
   students_enrolled: Number,
   number_lession: Number,
   avatar: String,
   isSell:Boolean,   //one image
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

module.exports = mongoose.model('Course', Course);
