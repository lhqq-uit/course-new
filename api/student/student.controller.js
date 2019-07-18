const fs = require('fs')
const Student = require('./student.model')
const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Quiz = require('./../quiz/quiz.model')

module.exports = {
   buyCourse: async (req, res) => { //còn trường hợp khóa học mua rồi thì không mua nữa
      try{
         let course = await Course.findByIdAndUpdate(req.params.idCourse,
                                 {$inc: {students_enrolled: +1}})
                                  .select('teacher price _id');
         let course_purchased = {
            id_course: req.params.idCourse,
            lesson_number: 0
         }
         if(!course) return res.status(404).json({message: 'Course not found'})
         await Student.findOneAndUpdate(
            {user: req.user.data._id},
            {$push: {courses: course_purchased}}                 //$addToSet
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
            { user: req.user.data._id, 
              "courses.id_course": req.params.idCourse},
            { $push: {"courses.$.lesson_number": req.params.idLesson}}
         );
         if(!course) return res.status(404).json('You have not purchased the course')
         res.status(200).json({message: 'set next lesson successfully'})
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   },
   getStudent: async (req, res) =>{
      try {
         let info = await Student.findOne({user: req.params.idStudent})
                              .populate('user').select('-_id');
         if(!info) return res.status(404).json('Student not found')
         res.status(200).json(info);
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   },
   getAllCoursePurchased: async (req, res) => {
      try {
         let course = await Student.findOne({user: req.user.data._id})
                              .populate('courses.id_course')
                              .select('courses -_id');
         if(!course) return res.status(404).json('Student not found')
         res.status(200).json(course);
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   },
   getAllCourseNotPurchased: async (req, res) => {
      try {
         let coursePurchased = await Student.findOne({user: req.user.data._id})
                              .select('courses.id_course -_id');
         if(!coursePurchased) return res.status(404).json('Student not found')
         let listIdCoursePurchased = []
         for(let i = 0; i < coursePurchased.courses.length ; i++){
            listIdCoursePurchased.push(coursePurchased.courses[i].id_course)
         }
         let courseNotPurchased = await Course.find({
             _id: { $nin: listIdCoursePurchased}
         })
         res.status(200).json(courseNotPurchased);
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   }
}