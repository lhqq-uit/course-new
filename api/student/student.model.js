var mongoose=require("mongoose");

var StudentSchema = mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   courses:[],
   // [{
   //    type: mongoose.Schema.Types.ObjectId,
   //    ref:'Course',
   //    id_course: String,
   //    lesson_number: {
   //       type: Number,
   //       default: 0           //mặc định chưa học bài nào
   //    }
   // }],
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