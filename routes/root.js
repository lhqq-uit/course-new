const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')
const jwtDecode = require('jwt-decode');
const axios = require('axios')


//TODO: show home page
router.get("/", async (req, res) => {
    var data = '';
    await axios({
        method: "get",
        url: `${domain}/api/course/populate/`
    }).then(req => {
        data = req.data;
        console.log(data)
    }).catch(error => {
        console.log(error);
    })
    res.render("index-2", {
        data: data
    });
})

//TODO: show dashboard
router.get("/dashboard", (req, res) => {
    let getInfoTeacher = jwtDecode(req.session.token)
    //console.log(getInfoTeacher)
    if (getInfoTeacher.role == "Teacher") {
        res.redirect("/teacher/dashboard")
    } else if (getInfoTeacher.role == "Student") {
        res.redirect("/student/dashboard")
    } else {
        res.redirect("/login")
    }
})

//TODO: login
router.get("/login", (req, res) => {
    let notificationError = false;
    var notificationSignUpTrue = false;
    if (req.session.SignUpTrue == true) { //TODO: signup true -> login -> push notification
        notificationSignUpTrue = true;
    }
    if (req.session.catchLogin == false) { //TODO: login false -> push err
        notificationError = true;
    }
    res.render("root/login", {
        notificationError: notificationError,
        notificationSignUpTrue: notificationSignUpTrue
    });
});

router.post("/login", (req, res) => {
    axios({
        method: 'post',
        url: `${domain}/api/signin`,
        data: {
            username: req.body.username,
            password: req.body.password
        }
    }).then(Response => {
        req.session.token = Response.data.token;
        //console.log(req.session.token)
        // console.log()
        if (req.session.token) {
            res.redirect('/dashboard')
        }

    }).catch(err => {
        //console.log(err)
        if (err.response.data.success == false) {
            req.session.catchLogin = false;
            res.redirect("/login");
        }
    })
});

//TODO: Reset password
router.get("/reset-password", (req, res) => {
    res.render("root/reset-password");
});

//TODO: Reset password
router.post("/reset-password", (req, res) => {
    axios({
            method: 'post',
            url: `${domain}/api/forgot-password`,
            data: {
                email: req.body.email
            }
        })
        .then(Response => {
            res.redirect('#')
        })
})

//TODO: change password
router.get("/change-password/:token", (req, res) => {
    req.session.token = req.params.authorization
    res.render("root/change-password");
});

//TODO: change-password to change-password.ejs
router.post("/change-password/:token", (req, res) => {
    if (req.body.password != req.body.password2) {
        res.redirect("#")
    } else {
        axios({
                method: 'post',
                url: `${domain}/api/reset-password/${req.params.token}`,
                data: {
                    password: req.body.password
                }
            })
            .then(Response => {
                res.redirect('/login')
            })
    }

});


//TODO: Sign Up

router.get("/signup", async (req, res) => {
    var notificationSignUpError = false;
    if (req.session.SignUpTrue == false) { //TODO: signin not true -> push err
        notificationSignUpError = true;
    }
    res.render("root/signup", {
        notificationSignUpError: notificationSignUpError
    });
});

router.post("/signup", (req, res) => {
    axios({
        method: 'post',
        url: `${domain}/api/signup`,
        data: {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
    }).then(Response => {
        //console.log(Response.data)
        req.session.SignUpTrue = true;
        res.redirect('/login');
    }).catch(err => {
        console.log(err)
        req.session.SignUpTrue = false;
        //console.log(req.session.SignUpTrue);
        res.redirect("/signup")
    })
});


module.exports = router;