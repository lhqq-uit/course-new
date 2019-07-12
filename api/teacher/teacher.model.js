var mongoose = require('mongoose');

var TeacherSchema = new mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   name: String,
   email: String,
   salary: {
      type: Number,
      default: 0,
   },
   iq: Number,
   avatar: String,   //one image
   images: [
      type
   ],
   courses:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
   }],
   transaction: [{   //total salary per day
      course:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Course'
      },
      time: Date,       
      total_value: Number
   }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);
