const Student = require('./student.model')
const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Quiz = require('./../quiz/quiz.model')

module.exports = {
   buyCourse: async (req, res) => {
      try{
         let course = await Course.findById(req.params.idCourse).select('teacher price _id');
         let course_purchased = {
            id_course: req.params.idCourse,
            lesson_number: 0
         }
         await Student.findOneAndUpdate(
            {user: req.user.data._id},
            {$push: {courses: course_purchased}} //$addToSet
         );
         if(!course) return res.status(404).json({message: 'Course not found'})
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
         let quiz = await Quiz.findById(req.params.idQuiz).select('result')
         let answer = {
            id: quiz._id,
            answer: req.body.answer,
            key: quiz.result
         }
         let check_answer= 'Wrong...';
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
   },
   setLessonStudied: async (req, res) => {
      try {
         let course = await Student.findOneAndUpdate(
            { user: req.user.data._id, "courses.id_course": req.params.idCourse},
            { $inc: {"courses.$.lesson_number": 1}}
         );
         if(!course) return res.status(404).json('You have not purchased the course')
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   },
   getStudent: async (req, res) =>{
      try {
         let info = await Student.findById(req.params.idStudent)
                              .populate('user').select('-_id');
         if(!info) return res.status(404).json('Student not found')
         res.status(200).json(info);
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   }
}