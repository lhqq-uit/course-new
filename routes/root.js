const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')

const axios = require('axios')


//TODO: show home page
router.get("/", (req, res) => {
    res.render("index-2");
})

//TODO: change password, Account Management
router.get("/Change-Password-Management", (req, res) => {
    res.render("root/change-password");
});


//TODO: login
router.get("/login", (req, res) => {
    let notificationError = false;
    var notificationSignUpTrue = false;
    if (req.session.SignUpTrue == true) {//TODO: signup true -> login -> push notification
        notificationSignUpTrue = true;
    }
    if (req.session.catchLogin == false) {//TODO: login false -> push err
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
        console.log(req.session.token)
        // console.log()
        if (req.session.token) {
            res.redirect('/teacher/dashboard')
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

<<<<<<< HEAD
router.get("/signup", async (req, res) => {
    var notificationSignUpError = false;
    if (req.session.SignUpTrue == false) {//TODO: signin not true -> push err
        notificationSignUpError = true;
    }
    res.render("root/signup", {
        notificationSignUpError: notificationSignUpError
    });
=======
router.get("/signup", (req, res) => {
    res.render("teacher/instructor-edit-quiz");
>>>>>>> EJS_Edit-quiz(teacher)
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
        console.log(Response.data)
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