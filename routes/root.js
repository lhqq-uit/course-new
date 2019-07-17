const express = require('express');
const router = express.Router();
const domain =require('./../config/domain')

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
    res.render("root/login");
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
        res.redirect('/teacher/dashboard');
    }).catch(err => {
        console.log(err)
    })
    
});


//TODO: Reset Password
exports.Reset_Password = (res, req) => {
    res.render("reset-password");
};

//TODO: Sign Up
exports.Sign_Up = (res, req) => {
    res.render("signup");
};


module.exports = router;