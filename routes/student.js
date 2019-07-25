const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')

const axios = require('axios')
const jwtDecode = require('jwt-decode');

//TODO: student-dashboard
router.get("/dashboard", async (req, res) => {
    var infoStudent='';
    var notificationLogin = false;
    if (req.session.token) { //TODO: check login session
        notificationLogin = true; // ! if true => push notification -> you are login

        let getInfoTeacher = jwtDecode(req.session.token)
        await axios({
                method: 'get',
                url: `${domain}/api/student/info/${getInfoTeacher._id}`,
                //responseType: 'stream'
            })
            .then(response => {
                // handle success
                //console.log(response.data);

                infoStudent = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        //console.log(iqTeacher) 
        res.render("student/student-dashboard", {
            infoStudent: infoStudent,
            notificationLogin: notificationLogin, // ! login true push notification
        });
    } else {
        res.redirect("../login")
    }
})

exports.Student_Dashboard = (req, res) => {
    res.render("student-dashboard");
};

//TODO: Student Dashboard>Discussions
exports.Student_Discussions = (res, req) => {
    res.render("student-discussions");
};

//TODO: Student Dashboard> Edit Account> Basic Information
exports.Student_Edit_Account = (res, req) => {
    res.render("student-edit-account");
};

//TODO: Student Dashboard>Change Password
exports.Student_Edit_Account_Password = (res, req) => {
    res.render("student-edit-account-password");
};

//TODO: Student Dashboard>student-edit-account-profile
exports.Student_Edit_Account_Profile = (res, req) => {
    res.render("student-edit-account-profile");
};

//TODO: Student Dashboard> student-my-courses
exports.Student_My_Courses = (res, req) => {
    res.render("student-my-courses");
};

//TODO: Student > student-take-course
exports.Student_Take_Course = (res, req) => {
    res.render("student-take-course");
};

//TODO: Student > student-take-lesson
router.get('/take-quiz/:idLesson/:numerical', (req, res) => {
    console.log(`${domain}/api/lesson/${req.params.idLesson}`)
    axios({
            method: 'get',
            url: `${domain}/api/lesson/${req.params.idLesson}`,
        })
        .then(Response => {
            countQuiz = Response.data.data.quizzes
            // for(i=0;i<countQuiz.length;i++){
            //     axios({})
            // }
            axios({
                    method: 'get',
                    url: `${domain}/api/quiz/${countQuiz[req.params.numerical]}`,
                })
                .then(Response2 => {
                    console.log(Response2.data.data)
                    let data = Response2.data.data
                    numerical = parseInt(req.params.numerical) + 1;
                    link_next = `/student/take-quiz/${req.params.idLesson}/${numerical}`;
                    res.render('student/student-take-quiz', {
                        countQuiz,
                        data,
                        link_next,
                        numerical
                    });
                })
            // console.log(countQuiz[0])

            // res.json(Response.data.data)

        })
    // res.render('student/student-take-quiz');
});


//TODO: Student > student-take-quiz
exports.Student_Take_Quiz = (res, req) => {
    res.render("student-take-quiz");
};

module.exports = router;