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