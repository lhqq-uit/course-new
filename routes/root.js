const express = require('express');
const router = express.Router();




//TODO: show home page
router.get("/", (req, res) => {
    res.render("index-2");
})

//TODO: change password, Account Management
router.get ("/Change-Password-Management", (req, res) => {
    res.render("root/change-password");
});


//TODO: login
router.get("/login", (res, req) => {
    res.render("root/login");
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