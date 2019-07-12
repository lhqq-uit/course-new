var mongoose=require('mongoose')

var Lesson=new mongoose.Schema(
   {
      course: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course'
      },
      title:String,
      desciption:String,
      video:String,
      document:String,
      quiz:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Quiz'
      }],
      comment:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment'
      }]
   }
)
module.exports = mongoose.model('Lesson', Lesson);
