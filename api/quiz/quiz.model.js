var mongoose=require("mongoose")

var QuizSchema = new mongoose.Schema({
   question:String,
   list_answer:[{
      type:String
   }],
   result:String
})

module.exports = mongoose.model('Quiz', QuizSchema);