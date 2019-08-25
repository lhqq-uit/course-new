var express = require('express');
var router = express.Router();
const domain = require('../config/domain');
const axios = require('axios');
const jwtDecode = require('jwt-decode');

/* GET users listing. */
router.get('/:idCourse', async function (req, res, next) {
    let course;
    let allcourse;
    var infoStudent = null;
    let getInfo = null;
    if (req.session.token) {
        getInfo = jwtDecode(req.session.token)
        //console.log(getInfoTeacher)
    }

    await axios({
        method: "get",
        url: `${domain}/api/course`,
    }).then(result => {
        allcourse = result.data
    }).catch(err => {
        // console.log(err)
        if (error.response.status == 403) {
            // res.redirect("/403")
        } else if (error.response.status == 404) {
            res.redirect("/404")
        } else if (error.response.status == 500) {
            res.redirect("/500")
        }
    })

    if (req.session.token) {

        let getInfoStudent = jwtDecode(req.session.token)
        if (getInfoStudent.role == "Teacher") {
            await axios({
                method: 'get',
                url: `${domain}/api/teacher/info/${getInfoStudent._id}`,
                //responseType: 'stream'
            })
                .then(response => {
                    // handle success
                    //console.log(response.data);

                    infoStudent = response.data;
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
                })
        } else {
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
                    //console.log(error);
                    if (error.response.status == 403) {
                        res.redirect("/403")
                    } else if (error.response.status == 404) {
                        res.redirect("/404")
                    } else if (error.response.status == 500) {
                        res.redirect("/500")
                    }
                })
        }

    }

    await axios({
        method: 'get',
        url: `${domain}/api/course/${req.params.idCourse}`
    }).then(Response => {
        course = Response.data;
        //console.log(course)
    }).catch(err => {
        //console.log(err)
        if (error.response.status == 403) {
            // res.redirect("/403")
        } else if (error.response.status == 404) {
            res.redirect("/404")
        } else if (error.response.status == 500) {
            res.redirect("/500")
        }
    });
    let topcourse;
    await axios({
        method: 'get',
        url: `${domain}/api/course/populate`
    }).then(Response => {
        topcourse = Response.data;
    }).catch(err => {
        // console.log(err)
        if (error.response.status == 403) {
            // res.redirect("/403")
        } else if (error.response.status == 404) {
            res.redirect("/404")
        } else if (error.response.status == 500) {
            res.redirect("/500")
        }
    });
    if (req.session.token) {
        let bought = false;
        if (infoStudent.role == "Teacher") {
            bought = true;
        } else if (infoStudent.role == "Student") {
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
                // console.log(err)
                if (error.response.status == 403) {
                    // res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    res.redirect("/500")
                }
            });
        }

        let checkRating = null;
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

                response.data.courses.forEach(e => {
                    if (e.id_course._id == req.params.idCourse) {
                        checkRating = true;
                    }
                });
            })
            .catch(error => {
                // handle error
                // console.log(error);
                if (error.response.status == 403) {
                    // res.redirect("/403")
                } else if (error.response.status == 404) {
                    res.redirect("/404")
                } else if (error.response.status == 500) {
                    // res.redirect("/500")
                    getCoursePurchased = "";
                }
            });
        res.render("student/student-take-course", { course, topcourse, bought, infoStudent, allcourse, checkRating, getInfo });
    } else {

        res.render("course/course", { course, topcourse, infoStudent, allcourse, getInfo });
    }
});


//todo: rating
router.get("/s/c/rating/:idCourse/:numStar", async (req, res) => {
    let url = `${domain}/api/course/rating/${req.params.idCourse}`;
    console.log(url);
    console.log(req.params.numStar)
    await axios({
        method: "put",
        baseURL: url,
        data: {
            rate: req.params.numStar
        },
        headers: {
            Authorization: req.session.token
        }
    }).then(r => {
        if (r.data.success == true) {
            res.redirect(`/course/${req.params.idCourse}`)
        }
    }).catch(err => {
        console.log(err)
        //res.redirect(`/course/${req.params.idCourse}`)
    })
})
module.exports = router;
