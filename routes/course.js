var express = require('express');
var router = express.Router();
const domain = require('../config/domain');
const axios = require('axios');

/* GET users listing. */
router.get('/:idCourse', async function(req, res, next) {
    let course;
    
    await axios({
            method: 'get',
            url: `${domain}/api/course/${req.params.idCourse}`
        }).then(Response => {
            course = Response.data;
        }).catch(err => {
            console.log(err)
        });
    let topcourse;
    await axios({
            method: 'get',
            url: `${domain}/api/course/populate`
        }).then(Response => {
            topcourse = Response.data;
        }).catch(err => {
            console.log(err)
        }); 
    if(req.session.token){
        let bought = false;
        await axios({
                method: 'get',
                url: `${domain}/api/student/courses-purchased`,
                headers: {
                    Authorization: req.session.token
                }
            }).then(Response => {
                Response.data.courses.forEach(element => {
                    // console.log(element.id_course._id)
                    if(element.id_course._id == req.params.idCourse){
                        bought = true;
                    }
                });
            }).catch(err => {
                console.log(err)
            });
        
        res.render("student/student-take-course", {course, topcourse, bought});
    } else{
        res.render("course/course", {course, topcourse});
    }
});

module.exports = router;
