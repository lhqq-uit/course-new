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
        console.log(req.session.token)
        res.redirect('/teacher/dashboard');
    }).catch(err => {
        console.log(err)
    })
    
});

//TODO: Reset password
router.get("/reset-password", (req, res) => {
    res.render("root/reset-password");
});

//TODO: Reset password
router.post("/reset-password", (req,res) =>{
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
    req.session.token=req.params.authorization
    res.render("root/change-password");
});

//TODO: change-password to change-password.ejs
router.post("/change-password/:token", (req, res) => {
    if(req.body.password!=req.body.password2){
        res.redirect("#")
    }
    else{
        axios({
            method: 'post',
            url: `${domain}/api/reset-password/${req.params.token}`,
            data: {
                password: req.body.password
            }
        })
        .then( Response => {
            res.redirect('/login')
        })
    }
    
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