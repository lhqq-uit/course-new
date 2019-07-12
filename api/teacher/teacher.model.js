var mongoose = require('mongoose');

var TeacherSchema = new mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   salary: {
      type: Number,
      default: 0,
   },
   iq: Number,
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
