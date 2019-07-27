const mongoose = require('mongoose')
const Student = require('./student.model')
const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Quiz = require('./../quiz/quiz.model')
const Lesson = require('./../lesson/lesson.model')

module.exports = {
   buyCourse: async (req, res) => {
      try {
         let student = await Student.findOne({
               user: req.user.data._id
            })
            .select('balance courses.id_course')
         let listIdCoursePurchased = []
         for (let i = 0; i < student.courses.length; i++) {
            listIdCoursePurchased.push(student.courses[i].id_course.toString())
         }
         if (listIdCoursePurchased.includes(req.params.idCourse))
            throw new Error('You bought the course')
         let course = await Course.findById(req.params.idCourse)
         if (student.balance < course.price) {
            throw new Error('Your balance is not enough!')
         }
         await Course.findByIdAndUpdate(req.params.idCourse, {
            $inc: {
               students_enrolled: +1,
               balance: -course.price
            }
         });
         let course_purchased = {
            id_course: req.params.idCourse,
            lesson_number: 0
         }
         await Student.findOneAndUpdate({
            user: req.user.data._id
         }, {
            $push: {
               courses: course_purchased
            }
         });
         let transaction = {
            course: course._id,
            date_trading: new Date().toLocaleDateString(),
            value: course.price
         }
         await Teacher.findOneAndUpdate({
            user: course.teacher
         }, {
            $inc: {
               salary: +course.price
            },
            $push: {
               transaction: transaction
            }
         })
         res.status(200).json({
            message: 'buy course successfully!'
         });
      } catch (error) {
         if (error.name == 'CastError')
            res.status(404).json({
               error_msg: "Course was not found"
            });
         res.status(500).json({
            error_msg: error.message
         })
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
         let check_answer = 'Wrong...';
         let iq = 0;
         if (req.body.answer && req.body.answer.toUpperCase() === quiz.result.toUpperCase()) {
            iq = 10;
            check_answer = 'Excellent!';
         }
         await Student.findOneAndUpdate({
            user: req.user.data._id
         }, {
            $push: {
               quiz: answer
            },
            $inc: {
               iq: +iq
            }
         });
         res.status(200).json({
            message: 'You have an answer',
            result: check_answer
         })
      } catch (error) {
         res.status(500).json({
            error_msg: error
         })
      }
   },
   setLessonStudied: async (req, res) => {
      try {
         let course = await Student.findOneAndUpdate({
            user: req.user.data._id,
            "courses.id_course": req.params.idCourse
         }, {
            $push: {
               "courses.$.lesson_number": req.params.idLesson
            }
         });
         if (!course) return res.status(404).json('You have not purchased the course')
         res.status(200).json({
            message: 'set next lesson successfully'
         })
      } catch (error) {
         res.status(500).json({
            err_msg: error.message
         })
      }
   },
   getStudent: async (req, res) => {
      try {
         let info = await Student.findOne({
               user: req.params.idStudent
            })
            .populate('user').select('-_id');
         if (!info) return res.status(404).json('Student not found')
         res.status(200).json(info);
      } catch (error) {
         res.status(500).json({
            err_msg: error.message
         })
      }
   },
   getAllCoursePurchased: async (req, res) => {
      try {
         let course = await Student.findOne({
               user: req.user.data._id
            })
            .populate({
               path: 'courses.id_course',
               populate: {
                  path: 'teacher',
                  select: "fullname -_id"
               }
            })
            .select('courses -_id');
         if (!course) return res.status(404).json('Student not found')
         res.status(200).json(course);
      } catch (error) {
         res.status(500).json({
            err_msg: error.message
         })
      }
   },
   getAllCourseNotPurchased: async (req, res) => {
      try {
         let coursePurchased = await Student.findOne({
               user: req.user.data._id
            })
            .select('courses.id_course -_id')
         if (!coursePurchased) return res.status(404).json('Student not found')
         let listIdCoursePurchased = []
         for (let i = 0; i < coursePurchased.courses.length; i++) {
            listIdCoursePurchased.push(coursePurchased.courses[i].id_course)
         }
         let courseNotPurchased = await Course.find({
               _id: {
                  $nin: listIdCoursePurchased
               }
            }).sort({
               _id: -1
            })
            .limit(3)
         res.status(200).json(courseNotPurchased);
      } catch (error) {
         res.status(500).json({
            err_msg: error.message
         })
      }
   },
}