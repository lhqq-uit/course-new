const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const jwtDecode = require('jwt-decode');


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
    }
])

const axios = require('axios')
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
    var infoTeacher = '';
    var notificationLogin = false;
    if (req.session.token) { //TODO: check login session
        notificationLogin = true; // ! if true => push notification -> you are login

        let getInfoTeacher = jwtDecode(req.session.token)
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
        res.render("teacher/instructor-dashboard", {
            infoTeacher: infoTeacher,
            dataChartArray: getTransactionOneWeek.value,
            getAverageMonthlySalary: getAverageMonthlySalary,
            getTransactionThisMonth: getTransactionThisMonth,
            getTransactionOneWeek: getTransactionOneWeek,
            notificationLogin: notificationLogin, // ! login true push notification
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
        if (getInfoTeacher == "Teacher") {
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
            let readStream = fs.createReadStream(`./public/upload/tmp/${req.files.image.originalname}`);

            const formHeaders = formData.getHeaders();
            formData.append("name", req.body.name);
            formData.append("topic", req.body.topic);
            formData.append("description", req.body.description);
            formData.append("price", req.body.price);
            formData.append("image", readStream);
            // console.log(formData)
            let config_axios = {
                headers: {
                    Authorization: req.session.token,
                    ...formHeaders
                }
            };
            await axios.post(`${domain}/api/course`, formData, config_axios)
                .then(function (response) {
                    fs.unlink(`/public/tmp/${req.file.originalname}`);
                    res.send(response)
                    res.redirect("/teacher/courses")
                })
                .catch(function (error) {
                    res.send(error)
                });
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/login');
    }
});

router.get("/edit-course/:idCourse", (req, res) => {
    axios({
        method: 'get',
        url: `${domain}/api/course/${req.params.idCourse}`
    }).then(result => {
        res.render('teacher/instructor-edit-course', {
            course: result.data
        });
    }).catch(error => {
        res.send(error.message)
    })

})

router.post("/edit-lesson/:idCourse", upload, async (req, res) => {

})


router.post("/add-lesson/:idCourse", upload, async (req, res) => {
    // res.json(req.files)
    for (let i = 0; i < req.body.title.length; i++) {
        let formData = await new FormData();
        let readStreamVideo = fs.createReadStream(`./public/upload/tmp/${req.files.video[i].originalname}`);
        let readStreamDoc = fs.createReadStream(`./public/upload/tmp/${req.files.document[i].originalname}`);

        const formHeaders = formData.getHeaders();
        formData.append("title", req.body.title[i]);
        formData.append("description", req.body.description[i]);
        formData.append("video", readStreamVideo);
        formData.append("document", readStreamDoc);
        // console.log(formData)
        let config_axios = {
            headers: {
                Authorization: req.session.token,
                ...formHeaders
            }
        };
        await axios.post(`${domain}/api/lesson/${req.params.idCourse}`, formData, config_axios)
            .then(function (response) {
                fs.unlink(`/public/tmp/${req.files.video[i].originalname}`);
                fs.unlink(`/public/tmp/${req.files.document[i].originalname}`);
                console.log(`created successfully for ${req.body.title[i]}`);
            })
            .catch(function (error) {
                res.send(error)
            });
    }
    res.redirect("/teacher/courses");
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
            console.log(response.data);
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
})
module.exports = router;