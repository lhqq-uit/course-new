var mongoose=require("mongoose");

var Student=mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   courses:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Course',
      lesson_number:Number
   }],
   quiz:[{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Quiz',
      },
      answer:String,
      result:String
   }]
})

module.exports = mongoose.model('Student', Student);