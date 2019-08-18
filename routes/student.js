const express = require("express");
const router = express.Router();
const domain = require("./../config/domain");
const axios = require("axios");
const jwtDecode = require("jwt-decode");

//TODO: student-dashboard
router.get("/dashboard", async (req, res) => {
    var infoStudent = "";
    var notificationLogin = false;
    if (req.session.token) {
        //TODO: check login session
        notificationLogin = true; // ! if true => push notification -> you are login

        let getInfoStudent = jwtDecode(req.session.token);
        await axios({
            method: "get",
            url: `${domain}/api/student/info/${getInfoStudent._id}`
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                infoStudent = response.data;
            })
            .catch(error => {
                // handle error
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });

        //console.log(iqTeacher)
        let getCoursePurchased = "";
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

                getCoursePurchased = response.data;
            })
            .catch(error => {
                // handle error
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    // res.redirect("/500")
                    getCoursePurchased = "";
                } 
            });

        let getCourseNotPurchased = "";
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
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });
        let getTotalIq = "";
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
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });

        let getIqAWeek = "";
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
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });
        let iqTotal7Day = 0;
        if (getIqAWeek.length > 0) {
            getIqAWeek.forEach(element => {
                iqTotal7Day += element * 1;
            });
        }

        let getCourseStudied = "";
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
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });

        res.render("student/student-dashboard", {
            infoStudent,
            getTotalIq,
            iqTotal7Day,
            getIqAWeek,
            getCourseStudied,
            getCoursePurchased,
            getCourseNotPurchased,
            notificationLogin // ! login true push notification
        });
    } else {
        res.redirect("../login");
    }
});

//TODO: Student > student-take-lesson
router.get("/take-quiz/:idLesson/:numerical", async (req, res) => {
    //Authorization is true
    if (req.session.token) {
        // console.log(`${domain}/api/lesson/${req.params.idLesson}`);
        let countQuiz = 0;
        await axios({
            method: "get",
            url: `${domain}/api/lesson/${req.params.idLesson}`,
            headers: {
                Authorization: req.session.token
            }
        }).then(Response => {
            countQuiz = Response.data.data.quizzes;
        }).catch(error => {
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });

        //Numerical is No.Quiz in lesson
        var numerical = parseInt(req.params.numerical);

        // Nothing quiz in lesson
        if (countQuiz.length == 0) {
            res.render("student/student-take-quiz", {
                countQuiz: null,
                data: null,
                numerical: 0
            });
        }

        // if -> Check last quiz in lesson else -> continue
        var link_next = false;
        if (numerical >= countQuiz.length - 1) {
            var urlCallAPI = `${domain}/api/quiz/${countQuiz[countQuiz.length - 1]}`;
        } else {
            var link_next = `${domain}/student/take-quiz/${
                req.params.idLesson
                }/${numerical + 1}`;
            var urlCallAPI = `${domain}/api/quiz/${countQuiz[req.params.numerical]}`;
        }

        var data;
        await axios({
            method: "get",
            url: urlCallAPI
        }).then(Response2 => {
            console.log(Response2.data.data);
            data = Response2.data.data;
            // /take-quiz/:idLesson/:numerical
        }).catch(error => {
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            }
        });

        let getInfoStudent = jwtDecode(req.session.token);

        let lesson;
        await axios({
            method: "get",
            url: `${domain}/api/lesson/${req.params.idLesson}`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(Response => {
                lesson = Response.data.data;
            })
            .catch(error => {
                // console.log(err);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });

        res.render("student/student-take-quiz", {
            countQuiz,
            data,
            numerical,
            link_next,
            course: lesson.course,
            infoStudent: getInfoStudent
        });

        //No Authorization
    } else {
        res.redirect("/login");
    }
});

router.post("/result-take-quiz/:idLesson", async (req, res) => {
    if (!req.session.token) {
        res.redirect("/login");
    } else {
        var list_question = [];
        await axios({
            method: "put",
            url: `${domain}/api/student/quiz/${req.params.idLesson}`,
            data: { answer: req.body.answer },
            headers: {
                Authorization: req.session.token
            }
        })
            .then(Response => {
                list_question = Response.data;
            })
            .catch(error => {
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });

        await axios({
            method: "get",
            url: `${domain}/api/student/set-course-studied`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => console.log(response.data))
            .catch(error => {
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });

        res.json(list_question);
    }
});

router.get("/result-take-quiz/:idLesson", async (req, res) => {
    if (!req.session.token) {
        res.redirect("/login");
    } else {
        let list_question = [];
        await axios({
            method: "get",
            url: `${domain}/api/quiz/allQuiz/${req.params.idLesson}`
        }).then(Response => {
            list_question = Response.data.data;
        }).catch(error => {
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });
        let getInfoStudent = jwtDecode(req.session.token);
        await axios({
            method: "get",
            url: `${domain}/api/student/info/${getInfoStudent._id}`
            //responseType: 'stream'
        })
            .then(response => {
                infoStudent = response.data;
            })
            .catch(error => {
                // handle error
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });

        let lesson;
        await axios({
            method: "get",
            url: `${domain}/api/lesson/${req.params.idLesson}`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(Response => {
                lesson = Response.data.data;
            })
            .catch(err => {
                // console.log(err);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });
        res.render("student/result-quiz", {
            list_question,
            infoStudent,
            course: lesson.course
        });
    }
});

//TODO: my course
router.get("/courses", async (req, res) => {
    if (!req.session.token) {
        res.redirect("/login");
    } else {
        let infoStudent;
        let getInfoStudent = jwtDecode(req.session.token);
        await axios({
            method: "get",
            url: `${domain}/api/student/info/${getInfoStudent._id}`
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                infoStudent = response.data;
            })
            .catch(error => {
                // handle error
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                } 
            });
        let courses;
        await axios({
            method: "get",
            url: `${domain}/api/student/courses-purchased/`,
            headers: {
                Authorization: req.session.token
            }
        }).then(Response => {
            // res.send(Response.data)
            courses = Response.data.courses;
        }).catch(error => {
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });

        let getTotalIq = "";
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
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });
        // res.send(courses)

        let getCourseStudied = "";
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
                // console.log(error);
                if (error.response.status == 403) {
                    res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });
        res.render("student/student-my-courses", {
            getCourseStudied,
            getTotalIq: getTotalIq,
            data: courses,
            infoStudent: infoStudent
        });
    }

    // res.render('student/student-take-quiz');
});

router.get("/profile/:id", async (req, res) => {
    var checkHeader = null;
    if (req.session.token) {
        checkHeader = 1;
    }
    await axios({
        method: "get",
        url: `${domain}/api/student/info/${req.params.id}`
        //responseType: 'stream'
    })
        .then(response => {
            // handle success
            //console.log(response.data);

            infoStudent = response.data;
        })
        .catch(error => {
            // handle error
            // console.log(error);
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });

    await axios({
        method: "get",
        url: `${domain}/api/student/total-iq/${req.params.id}`
    })
        .then(response => {
            // handle success
            //console.log(response.data.total_iq);

            getTotalIq = response.data.total_iq;
        })
        .catch(error => {
            // handle error
            // console.log(error);
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });

    let getIqAWeek = "";
    await axios({
        method: "get",
        url: `${domain}/api/student/iq-a-week/${req.params.id}`
    })
        .then(response => {
            // handle success
            //console.log(response.data.list_iq);

            getIqAWeek = response.data.list_iq;
        })
        .catch(error => {
            // handle error
            // console.log(error);
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            } 
        });
    let iqTotal7Day = 0;
    if (getIqAWeek.length > 0) {
        getIqAWeek.forEach(element => {
            iqTotal7Day += element * 1;
        });
    }

    let getCourseStudied = "";
    await axios({
        method: "get",
        url: `${domain}/api/student/course-studied/${req.params.id}`
    })
        .then(response => {
            // handle success
            console.log(response.data);

            getCourseStudied = response.data.course_studied;
        })
        .catch(error => {
            // handle error
            // console.log(error);
            if (error.response.status == 403) {
                res.redirect("/403")
            } else if (error.response.status == 404) {
                res.redirect("/404")
            } else if (error.response.status == 500) {
                res.redirect("/500")
            }
        });

    res.render("student/profile", {
        iqTotal7Day,
        getIqAWeek,
        getCourseStudied,
        getTotalIq,
        checkHeader,
        infoStudent
    });
    // res.render('student/student-take-quiz');
});

module.exports = router;
