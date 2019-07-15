const Student = require('./student.model')
const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Quiz = require('./../quiz/quiz.model')

module.exports = {
   buyCourse: async (req, res) => {
      try{
         let course = await Course.findById(req.params.id).select('teacher price _id');
         await Student.findOneAndUpdate(
            {user: req.user.data._id},
            {$addToSet: {courses: req.params.id}}
         );
         let transaction = {
            course: course._id,
            date_trading: new Date().toLocaleDateString(),
            value: course.price
         }
         await Teacher.findOneAndUpdate(
            {user: course.teacher},
            {$inc: {salary: +course.price},
             $push: {transaction: transaction}}
         )
         res.status(200).json({message: 'buy course successfully!'});
      }
      catch(error){
         res.status(500).json({error_msg: error.message})
      }
   },      
   answerQuestion: async (req, res) => {
      try {
         let quiz = await Quiz.findById(req.params.id).select('result')
         let answer = {
            id: quiz._id,
            answer: req.body.answer,
            key: quiz.result
         }
         let check_answer= 'You Fail!';
         let iq = 0;
         if(req.body.answer && req.body.answer.toUpperCase() === quiz.result.toUpperCase()){
            iq = 10;
            check_answer= 'Excellent!';
         }
         await Student.findOneAndUpdate(
            {user: req.user.data._id},
            {$push: {quiz: answer},
             $inc: {iq: +iq}}
         );
         res.status(200).json({
            message: 'You have an answer',
            result: check_answer
         })
      } catch (error) {
         res.status(500).json({error_msg: error})
      }
   } 
}