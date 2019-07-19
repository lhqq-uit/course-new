const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');

var storage =   multer.diskStorage({
    // file upload destination
    destination: function (req, file, callback) {
      callback(null, './public/upload/tmp');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });
var upload = multer({ storage : storage});

const axios = require('axios')

//TODO: dashboard teacher
router.get("/dashboard", (req, res) => {
    res.render("teacher/instructor-dashboard");
});

//TODO: add course
router.get("/add-course", (req, res) => {
    if(!req.session.token){
        res.redirect('/login')
    } else{
        res.render("teacher/instructor-add-course");
    }
});

router.post("/add-course", upload.single('image'), async (req, res) => {
    if(!req.session.token){
        res.redirect('/login')
    }else{
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
            headers:{
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


router.get("/courses", (req, res)=> {
    res.render("teacher/instructor-courses.ejs");
});

module.exports = router;