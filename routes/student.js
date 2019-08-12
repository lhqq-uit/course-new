const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')

const axios = require('axios')
const jwtDecode = require('jwt-decode');

//TODO: student-dashboard
router.get("/dashboard", async (req, res) => {
    var infoStudent = '';
    var notificationLogin = false;
    if (req.session.token) { //TODO: check login session
        notificationLogin = true; // ! if true => push notification -> you are login

        let getInfoStudent = jwtDecode(req.session.token)
        await axios({
            method: 'get',
            url: `${domain}/api/student/info/${getInfoStudent._id}`,
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
        let getCoursePurchased = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/courses-purchased`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                console.log(response.data.courses);

                getCoursePurchased = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        let getCourseNotPurchased = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/courses-not-purchased`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getCourseNotPurchased = response.data;
            })
            .catch(error => {
                // handle error
                //console.log(error);
            })
        let getTotalIq = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/total-iq`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data.total_iq);

                getTotalIq = response.data.total_iq;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        let getIqAWeek = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/iq-a-week`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data.list_iq);

                getIqAWeek = response.data.list_iq;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
        let iqTotal7Day = 0;
        if (getIqAWeek.length > 0) {
            getIqAWeek.forEach(element => {
                iqTotal7Day += element * 1;
            });
        }

        let getCourseStudied = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/course-studied`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                console.log(response.data);

                getCourseStudied = response.data.course_studied;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })


        res.render("student/student-dashboard", {
            infoStudent,
            getTotalIq,
            iqTotal7Day,
            getIqAWeek,
            getCourseStudied,
            getCoursePurchased,
            getCourseNotPurchased,
            notificationLogin, // ! login true push notification
        });
    } else {
        res.redirect("../login")
    }
})

//TODO: Student > student-take-lesson
router.get('/take-quiz/:idLesson/:numerical', async (req, res) => {

    //Authorization is true
    if(req.session.token){
        console.log(`${domain}/api/lesson/${req.params.idLesson}`)
        let countQuiz = 0;
        let link_next = '';
        //call API lesson/idLesson from lesson to get a lesson
        await axios({
            method: 'get',
            url: `${domain}/api/lesson/${req.params.idLesson}`,
            headers: {
                Authorization: req.session.token
            }
        })
        .then(Response => {
            countQuiz = Response.data.data.quizzes;
            console.log("So luong --------------------------")
            console.log(countQuiz.length)
        })

        // Nothing quiz in lesson
        if (countQuiz.length == 0) {
            res.render('student/student-take-quiz', {
                countQuiz: null,
                data: null,
                link_next: null,
                numerical: 0
            })
        }

        //Numerical is No.Quiz in lesson
        var numerical = parseInt(req.params.numerical);
        
        // if -> Check last quiz in lesson else -> continue
        if (numerical >= countQuiz.length) {
            res.send(`${domain}/student/take-quiz/${req.params.idLesson}/${countQuiz.length-1}`)
        }else{
            //Get quiz in lesson
            axios({
                method: 'get',
                url: `${domain}/api/quiz/${countQuiz[req.params.numerical]}`,
            })
                .then(Response2 => {

                    console.log(Response2.data.data)
                    let data = Response2.data.data
                    // /take-quiz/:idLesson/:numerical
                    res.render('student/student-take-quiz', {
                        countQuiz,
                        data,
                        link_next: `/student/take-quiz/${req.params.idLesson}/${numerical+1}`,
                        numerical: numerical + 1
                    });
                })
        }

        //No Authorization
        }else{
            res.redirect('/login');
        }
});

//TODO: my course
router.get('/courses', async (req, res) => {

    if (!req.session.token) {
        res.redirect("/login")
    } else {
        let infoStudent;
        let getInfoStudent = jwtDecode(req.session.token)
        await axios({
            method: 'get',
            url: `${domain}/api/student/info/${getInfoStudent._id}`,
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
        let courses;
        await axios({
            method: 'get',
            url: `${domain}/api/student/courses-purchased/`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(Response => {
                // res.send(Response.data)
                courses = Response.data.courses
            })

        let getTotalIq = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/total-iq`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data.total_iq);

                getTotalIq = response.data.total_iq;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
        // res.send(courses)


        let getCourseStudied = '';
        await axios({
            method: "get",
            url: `${domain}/api/student/course-studied`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                console.log(response.data);

                getCourseStudied = response.data.course_studied;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
        res.render("student/student-my-courses", {
            getCourseStudied,
            getTotalIq: getTotalIq,
            data: courses,
            infoStudent: infoStudent
        })
    }

    // res.render('student/student-take-quiz');
});

router.get('/profile/:id', async (req, res) => {
    var checkHeader = null;
    if (req.session.token) {
        checkHeader = 1;
    }
    await axios({
        method: 'get',
        url: `${domain}/api/student/info/${req.params.id}`,
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

    await axios({
        method: "get",
        url: `${domain}/api/student/total-iq/${req.params.id}`,

    })
        .then(response => {
            // handle success
            //console.log(response.data.total_iq);

            getTotalIq = response.data.total_iq;
        })
        .catch(error => {
            // handle error
            console.log(error);
        })

    let getIqAWeek = '';
    await axios({
        method: "get",
        url: `${domain}/api/student/iq-a-week/${req.params.id}`,

    })
        .then(response => {
            // handle success
            //console.log(response.data.list_iq);

            getIqAWeek = response.data.list_iq;
        })
        .catch(error => {
            // handle error
            console.log(error);
        })
    let iqTotal7Day = 0;
    if (getIqAWeek.length > 0) {
        getIqAWeek.forEach(element => {
            iqTotal7Day += element * 1;
        });
    }

    let getCourseStudied = '';
    await axios({
        method: "get",
        url: `${domain}/api/student/course-studied/${req.params.id}`,

    })
        .then(response => {
            // handle success
            console.log(response.data);

            getCourseStudied = response.data.course_studied;
        })
        .catch(error => {
            // handle error
            console.log(error);
        })

    res.render("student/profile", {
        iqTotal7Day,
        getIqAWeek,
        getCourseStudied,
        getTotalIq,
        checkHeader,
        infoStudent
    })
    // res.render('student/student-take-quiz');
});

module.exports = router;