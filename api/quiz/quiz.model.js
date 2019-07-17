var mongoose=require("mongoose")

var QuizSchema = new mongoose.Schema({
   question: {
      type: String,
      required: 'Question is required'
   },
   list_answer:{
      type: [String], 
      required: 'Answer is required' //not work
   },
   result:{
      type: String,
      required: 'Result is required'
   }
})

module.exports = mongoose.model('Quiz', QuizSchema);