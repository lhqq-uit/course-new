const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')

const axios = require('axios')


//TODO: edit quiz -> add question to quiz in lesson

router.get("/edit-quiz/:idLesson", (req, res) =>{
    

    let info=axios({
        method: 'get',
        url: `${domain}/api/lesson/${req.params.idLesson}`,
    })
    .then( Response =>{
        let lesson=Response.data
        let course=axios({
            method: 'get',
            url: `${domain}/api/course/${lesson.data.course}`,
        }).then (Response2 => {
            // res.json(lesson.data.title)
            res.render('teacher/instructor-edit-quiz', {lesson: lesson.data.title, course: Response2.data.name})
        })



        
        // res.json(data)
    })
    // res.render('teacher/instructor-edit-quiz')
})

//TODO: edit quiz
router.post("/edit-quiz/:idLesson", (req,res) =>{

    // console.log(req.params.idLesson)
    // res.redirect('/login')

    // res.json(req.body)
    console.log(req.session.token)
    axios({
        method: 'post',
        url: `${domain}/api/quiz/${req.params.idLesson}`,
        data: {
            question: req.body.question,
            list_answer: req.body.list_answer,
            result: req.body.result
        },
        headers:{
            Authorization: req.session.token 
        }
    })
    .then(Response =>{
        res.redirect(`/teacher/edit-quiz/${req.params.idLesson}`)
    })
})

// //TODO: instructor-courses, this's Manage Courses teacher
// exports.Teacher_Manage_Courses = (req, res) => {
//     res.render("instructor-courses");
// };

// //TODO: dashboard teacher
router.get("/dashboard", (req, res) => {

    var notificationLogin = false;
    if(req.session.token){//TODO: check login session
        notificationLogin = true;// ! if true => push notification -> you are login
    }
    res.render("teacher/instructor-dashboard", {
        notificationLogin: notificationLogin
    });
});

// //TODO: instructor-earnings, teacher dashboard reports
// exports.Teacher_Dashboard_Report = (req, res) => {
//     res.render("instructor-earnings");
// };

// //TODO: instructor-edit-course, add course for teacher
// exports.Teacher_Dashboard_Add_Course = (req, res) => {
//     res.render("instructor-edit-course");
// };

// //TODO: instructor-edit-quiz, add quiz for course
// exports.Teacher_Dashboard_Add_Quiz_For_Course = (res, req) => {
//     res.render("instructor-edit-quiz");
// };

// //TODO: Manage Quizzes, Dashboard teacher
// // exports.Teacher_Dashboard_Manage_Quizzes = (res, req) => {
// //     res.render("instructor-quizzes");
// // };

// //TODO: Dashboard>Reports>Statement, instructor-statement
// exports.Teacher_Dashboard_Statement = (res, req) => {
//     res.render("instructor-statement");
// };



module.exports = router;