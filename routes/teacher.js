const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const jwtDecode = require('jwt-decode');
//const io = require('socket.io')(http);


var storage = multer.diskStorage({
    // file upload destination
    destination: function (req, file, callback) {
        callback(null, './public/upload/tmp');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).fields([{
    name: 'image'
},
{
    name: 'video'
},
{
    name: 'document'
},,
{
    name: 'trailer'
}
]);

const axios = require('axios')

router.get("/quizzes", async(req, res) => {
    if(!req.session){
        res.redirect('/login');
    }else{
        let getInfoTeacher = jwtDecode(req.session.token);
        // res.send(getInfoTeacher);
        //var courses;
        await axios({
            method: 'get',
            url: `${domain}/api/teacher/courses/${getInfoTeacher._id}`,
            headers: {
                Authorization: req.session.token,
            }
        })
        .then(Response => {
            console.log(Response.data.courses)
            courses = Response.data
        })
        .catch(error => {
            res.status(400).json(error.message);
        })
        var infoTeacher = '';
        await axios({
            method: 'get',
            url: `${domain}/api/teacher/info/${getInfoTeacher._id}`,
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                infoTeacher = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
        res.render('teacher/instructor-edit-quiz', {
            courses,
            infoTeacher,
        });
    }
})
//TODO: edit quiz -> add question to quiz in lesson

router.get("/edit-quiz/:idLesson", (req, res) => {

    let info = axios({
        method: 'get',
        url: `${domain}/api/lesson/${req.params.idLesson}`,
    })
        .then(Response => {
            let lesson = Response.data
            let course = axios({
                method: 'get',
                url: `${domain}/api/course/${lesson.data.course}`,
            }).then(Response2 => {
                // res.json(lesson.data.title)
                res.render('teacher/instructor-edit-quiz', {
                    lesson: lesson.data.title,
                    course: Response2.data.name
                })
            })
            // res.json(data)
        })
    // res.render('teacher/instructor-edit-quiz')
})


//TODO: Show all quizzes
// router.get("/quizzes/:idLesson", (req, res) => {
//     data=axios({
//         method: 'get',
//         url: `${domain}/api/allQuiz/${req.params.idLesson}`,
//     })

// })
//TODO: edit quiz
router.post("/edit-quiz/:idLesson", (req, res) => {

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
        headers: {
            Authorization: req.session.token
        }
    })
        .then(Response => {
            res.redirect(`/teacher/edit-quiz/${req.params.idLesson}`)
        })
})

//TODO: dashboard teacher
router.get("/dashboard", async (req, res) => {

    if (req.session.token) { //TODO: check login session

        var notificationLogin = false;
        notificationLogin = true; // ! if true => push notification -> you are login

        let getInfoTeacher = jwtDecode(req.session.token)
        var infoTeacher = '';
        await axios({
            method: 'get',
            url: `${domain}/api/teacher/info/${getInfoTeacher._id}`,
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                infoTeacher = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        var getTransactionOneWeek = '';
        await axios({
            method: "get",
            url: `${domain}/api/teacher/transaction-one-week`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getTransactionOneWeek = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        var getTransactionThisMonth = '';
        await axios({
            method: "get",
            url: `${domain}/api/teacher/transaction-this-month`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getTransactionThisMonth = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        var getAverageMonthlySalary = '';
        await axios({
            method: "get",
            url: `${domain}/api/teacher/average-salary`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getAverageMonthlySalary = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
        //console.log(iqTeacher) 

        var getCommentTeacher = '';
        await axios({
            method: 'get',
            url: `${domain}/api/comment/t/${getInfoTeacher._id}`,
            headers: {
                Authorization: req.session.token
            }
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getCommentTeacher = response.data;
                //console.log(getCommentTeacher)
                // getCommentTeacher.forEach(element => {
                //     console.log(element)
                // });
                // ? https://pastebin.com/dVDLsgW7
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        // io.on('connection', socket => {
        //     console.log('A user connected');

        //     //Send a message when 
        //     // setTimeout(() => {
        //     //     //Sending an object when emmiting an event

        //     // },000);

        //     socket.on('disconnect', () => {
        //         console.log('A user disconnected');
        //     });
        //     socket.on('clientEvent', data => {
        //         console.log(data);
        //     });
        //     socket.emit('testerEvent', {
        //         description: 'A custom event named testerEvent!'
        //     });
        // });

        res.render("teacher/instructor-dashboard", {
            infoTeacher: infoTeacher,
            getCommentTeacher: getCommentTeacher,
            dataChartArray: getTransactionOneWeek.value,
            getAverageMonthlySalary: getAverageMonthlySalary,
            getTransactionThisMonth: getTransactionThisMonth,
            getTransactionOneWeek: getTransactionOneWeek,
            notificationLogin: notificationLogin,
            token: req.session.token,
            // idQuiz:
            // ! login true push notification
        });
    } else {
        res.redirect("../login")
    }
});

//TODO: add course
router.get("/add-course", (req, res) => {

    if (!req.session.token) {
        res.redirect('/login')
    } else {
        let getInfoTeacher = jwtDecode(req.session.token)
        if (getInfoTeacher.role == "Teacher") {
            res.render("teacher/instructor-add-course", {
                teacher: getInfoTeacher,
            });
        } else {
            res.redirect('/')
        }
    }
});

router.post("/add-course", upload, async (req, res) => {

    if (req.session.token) {
        let getInfoTeacher = jwtDecode(req.session.token);
        if (getInfoTeacher.role == "Teacher") {
            let formData = await new FormData();
            let readStream = fs.createReadStream(`./public/upload/tmp/${req.files.image[0].originalname}`);
            let readTrailerStream = fs.createReadStream(`./public/upload/tmp/${req.files.trailer[0].originalname}`);
            const formHeaders = formData.getHeaders();
            formData.append("name", req.body.name);
            formData.append("topic", req.body.topic);
            formData.append("description", req.body.description);
            formData.append("price", req.body.price);
            formData.append("tag", req.body.tag);
            formData.append("image", readStream);
            formData.append("trailer", readTrailerStream);
            // console.log(formData)
            let config_axios = {
                headers: {
                    Authorization: req.session.token,
                    ...formHeaders
                }
            };
            await axios.post(`${domain}/api/course`, formData, config_axios)
                .then(function (response) {
                    fs.unlink(`/public/tmp/${req.files.image[0].originalname}`);
                    fs.unlink(`/public/tmp/${req.files.trailer[0].originalname}`);
                    // res.send(response)
                    res.redirect("/teacher/courses")
                })
                .catch(function (error) {
                    res.redirect("/teacher/courses")
                    // res.send(error)
                });
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/login');
    }
});

router.get("/edit-course/:idCourse", async (req, res) => {
    if (req.session.token) {
        let getInfoTeacher = jwtDecode(req.session.token);
        await axios({
            method: 'get',
            url: `${domain}/api/course/${req.params.idCourse}`
        }).then(result => {
            res.render('teacher/instructor-edit-course', {
                course: result.data,
                user: getInfoTeacher
            });

        }).catch(error => {
            res.send(error.message)
        })
    } else {
        res.redirect('/login');
    }
});

router.post("/edit-course/:idCourse", upload, async (req, res) => {
    if (req.session.token) {
        let getInfoTeacher = jwtDecode(req.session.token);
        let formData = await new FormData();
        let readStream = fs.createReadStream(`./public/upload/tmp/${req.files.image[0].originalname}`);
        let readTrailerStream = fs.createReadStream(`./public/upload/tmp/${req.files.trailer[0].originalname}`);
        const formHeaders = formData.getHeaders();
        formData.append("name", req.body.name);
        formData.append("topic", req.body.topic);
        formData.append("description", req.body.description);
        formData.append("price", req.body.price);
        formData.append("tag", req.body.tag);
        formData.append("image", readStream);
        formData.append("trailer", readTrailerStream);
        // console.log(formData)
        let config_axios = {
            headers: {
                Authorization: req.session.token,
                ...formHeaders
            }
        };
        await axios.put(`${domain}/api/course/${req.params.idCourse}`, formData, config_axios)
            .then(function (response) {
                fs.unlink(`/public/tmp/${req.files.image[0].originalname}`);
                fs.unlink(`/public/tmp/${req.files.trailer[0].originalname}`);
                // res.send(response)
                res.redirect("/teacher/courses")
            })
            .catch(function (error) {
                res.send(error)
            });
        // } else {
        //     res.redirect('/')
        // }
    } else {
        res.redirect('/login');
    }
})

router.post("/add-lesson/:idCourse", upload, async (req, res) => {
    // res.json(req.files)
    if (req.session.token) {
        let formData = await new FormData();
        let readStreamVideo = await fs.createReadStream(`./public/upload/tmp/${req.files.video[0].originalname}`);
        let readStreamDoc = await fs.createReadStream(`./public/upload/tmp/${req.files.document[0].originalname}`);

        const formHeaders = await formData.getHeaders();
        formData.append("title", req.body.title);
        formData.append("description", req.body.description);
        formData.append("video", readStreamVideo);
        formData.append("document", readStreamDoc);
        // console.log(formData)
        let config_axios = {
            headers: {
                Authorization: req.session.token,
                ...formHeaders
            }
        };

        await axios({
                method: 'post',
                url: `${domain}/api/lesson/${req.params.idCourse}`,
                data: formData,
                headers: config_axios.headers,
                //responseType: 'stream'
            })
            .then(function (response) {
                fs.unlink(`/public/tmp/${req.files.video[0].filename}`);
                fs.unlink(`/public/tmp/${req.files.document[0].file}`);
                console.log(`created successfully for ${req.body.title}`);
                // res.send("ok");
            }).catch(function(error){
                // res.send(error.message)
                res.redirect("/teacher/courses");
            });
        
    } else {
        res.redirect('/login');
    }
})

router.post("/edit-lesson/:idCourse", upload, async (req, res) => {

})

router.get("/courses", (req, res) => {
    let getInfoTeacher = jwtDecode(req.session.token)
    axios({
        method: 'get',
        url: `${domain}/api/teacher/courses/${getInfoTeacher._id}`,
        //responseType: 'stream'
    })
        .then(response => {
            // handle success
            // console.log(response.data);
            res.render("teacher/instructor-courses.ejs", {
                courses: response.data.courses,
                user: getInfoTeacher
            });
        })
        .catch(error => {
            // handle error
            console.log(error);
        })

});

//TODO: show statement
router.get("/statement", async (req, res) => {
    if (req.session.token) { //TODO: check login session
        var getTransactionOneWeek = '';
        await axios({
            method: "get",
            url: `${domain}/api/teacher/transaction-one-week`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(response => {
                // handle success
                //console.log(response.data);

                getTransactionOneWeek = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        let getInfoTeacher = jwtDecode(req.session.token)
        await axios({
            method: 'get',
            url: `${domain}/api/teacher/info/${getInfoTeacher._id}`,
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                console.log(response.data);

                infoTeacher = response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })

        res.render("teacher/instructor-statement", {
            infoTeacher: infoTeacher,
            getTransactionOneWeek: getTransactionOneWeek
        })
    } else res.redirect("../login")
});

router.get('/delete-lesson/:idLesson', async (req, res) => {
    await axios({
        method: 'delete',
        url: `${domain}/api/lesson/${req.params.idLesson}`,
        headers: {
            Authorization: req.session.token
        }
    })
        .then(response => {
            // handle success
            res.redirect('back');
        })
        .catch(error => {
            // handle error
            console.log(error);
            res.status(500);
        })
})

router.get('/delete-course/:idCourse', async (req, res) => {
    await axios({
        method: 'delete',
        url: `${domain}/api/course/${req.params.idCourse}`,
        headers: {
            Authorization: req.session.token
        }
    })
        .then(response => {
            // handle success
            res.redirect('/teacher/courses');
        })
        .catch(error => {
            // handle error
            // console.log(error);
            res.status(500).send(error.message);
        })
})

router.get('/profile/:id', async (req, res) => {
    var checkHeader = null;
    if (req.session.token) {
        checkHeader = 1;
    }
    await axios({
        method: 'get',
        url: `${domain}/api/teacher/info/${req.params.id}`,
        //responseType: 'stream'
    })
        .then(response => {
            // handle success
            //console.log(response.data);

            infoTeacher = response.data;
        })
        .catch(error => {
            // handle error
            console.log(error);
        })

        await axios({
            method: 'get',
            url: `${domain}/api/teacher/courses/${req.params.id}`,
            //responseType: 'stream'
        })
            .then(response => {
                // handle success
                //console.log(response.data);
    
                coursesForTeacher = response.data.courses;
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
    
    res.render("teacher/profile", {
        coursesForTeacher,
        infoTeacher,
        checkHeader
    })
})

module.exports = router;