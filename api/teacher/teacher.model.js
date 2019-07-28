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
   iq: {
      type: Number,
      default: 0,
   },
   courses:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
   }],
   transaction: [{  
      course:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Course'
      },
      date_trading: String,       //using $group to calculate sum value in one date
      value: Number
   }],
   timeCreated: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
