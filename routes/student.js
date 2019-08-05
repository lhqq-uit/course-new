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
                //console.log(response.data.courses);

                getCoursePurchased = response.data.courses;
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
            infoStudent: infoStudent,
            getTotalIq: getTotalIq,
            iqTotal7Day: iqTotal7Day,
            getIqAWeek: getIqAWeek,
            getCourseStudied: getCourseStudied,
            getCoursePurchased: getCoursePurchased,
            getCourseNotPurchased: getCourseNotPurchased,
            notificationLogin: notificationLogin, // ! login true push notification
        });
    } else {
        res.redirect("../login")
    }
})

//TODO: Student Dashboard>Change Password
router.get("/edit-account-password", async (req, res) => {
    if (req.session.token) {
        //decode token
        let getInfoStudent = jwtDecode(req.session.token)
        console.log(getInfoStudent)
        let student = axios({
            method: 'get',
            url: `${domain}/api/student/info/${getInfoStudent._id}`
        })
            .then(response => {
                data = response.data;
                res.render("student/student-edit-account-password", {
                    data
                })
            })
    } else {
        res.redirect("../login")
    }
})

router.post("/edit-account-password", (req, res) => {
    if (!req.session.token) {
        res.redirect("../login")
    } else {
        try {
            axios({
                method: 'post',
                url: `${domain}/api/change-password`,
                headers: {
                    Authorization: req.session.token
                },
                data: {
                    Oldpassword: req.body.Oldpassword,
                    newPassword: req.body.newPassword,
                    confirmPassword: req.body.confirmPassword

                }
            })
                .then(Response => {
                    res.redirect('../login')
                })
                .catch(err => {
                    res.redirect('/student/edit-account-password')
                })
        } catch (error) {
            res.redirect('/student/edit-account-password')
        }

    }

});


//TODO: Student Dashboard>student-edit-account-profile
router.get("/edit-account", async (req, res) => {
    if (req.session.token) {
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
        //decode token
        let getInfoStudent = jwtDecode(req.session.token)
        let data;
        console.log(getInfoStudent)
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
            
        res.render("student/student-edit-account", {
            infoStudent,
            getTotalIq
        })
    } else {
        res.redirect("../login")
    }
})

router.get("/edit-account-profile", async (req, res) => {
    if (req.session.token) {
        //decode token
        let getInfoStudent = jwtDecode(req.session.token)
        console.log(getInfoStudent)
        let student = axios({
            method: 'get',
            url: `${domain}/api/student/info/${getInfoStudent._id}`
        })
            .then(response => {
                data = response.data;
                res.render("student/student-edit-account-profile", {
                    data
                })
            })
    } else {
        res.redirect("../login")
    }
})

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
module.exports = router;