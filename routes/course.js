var express = require('express');
var router = express.Router();
const domain = require('../config/domain');
const axios = require('axios');
const jwtDecode = require('jwt-decode');

/* GET users listing. */
router.get('/:idCourse', async function (req, res, next) {
    let course;
    var infoStudent= null;
    if (req.session.token) {
       
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
    }

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
    if (req.session.token) {
        
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
                if (element.id_course._id == req.params.idCourse) {
                    bought = true;
                }
            });
        }).catch(err => {
            console.log(err)
        });

        res.render("student/student-take-course", { course, topcourse, bought, infoStudent });
    } else {
        res.render("course/course", { course, topcourse, infoStudent });
    }
});

module.exports = router;
