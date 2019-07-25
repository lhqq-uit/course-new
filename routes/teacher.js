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
});

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
    var infoTeacher='';
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

        //console.log(iqTeacher) 
        res.render("teacher/instructor-dashboard", {
            infoTeacher: infoTeacher,
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
        res.render("teacher/instructor-add-course", {
            avatarTeacher: getInfoTeacher.avatar,
        });
    }
});

router.post("/add-course", upload.single('image'), async (req, res) => {
    if (!req.session.token) {
        res.redirect('/login')
    } else {
        let formData = await new FormData();
        let readStream = fs.createReadStream(`./public/upload/tmp/${req.file.originalname}`);

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
                res.send(response)
                res.redirect("/teacher/courses")
            })
            .catch(function (error) {
                res.send(error)
            });
    }
});


router.get("/courses", (req, res) => {
    res.render("teacher/instructor-courses.ejs");
});

module.exports = router;