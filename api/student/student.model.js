var mongoose=require("mongoose");

var StudentSchema = mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   courses:[{
      id_course:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'Course'
      },
      lesson_number: Number
   }],
   iq: {
      type: Number,
      default: 0
   },
   quiz:[{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Quiz',
      },
      answer:String,
      key:String
   }]
})

module.exports = mongoose.model('Student', StudentSchema);