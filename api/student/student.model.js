var mongoose=require("mongoose");

var StudentSchema = mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   balance: {
      type: Number,
      default: 0
   },
   courses:[{
      id_course:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'Course'
      },
      lesson_number: []
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
   // lessons: [{
   //    id_lesson:{
   //       type: mongoose.Schema.Types.ObjectId,
   //       ref:'Lesson'
   //    },
   //    quiz_true: []

})

module.exports = mongoose.model('Student', StudentSchema);