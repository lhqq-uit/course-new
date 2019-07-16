var User = require('./users.model');
let Teacher = require('../teacher/teacher.model');
let Student = require('../student/student.model');
var jwt = require('jsonwebtoken');
var config = require('../../config/database');
let nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    SignUp: async (req, res)=>{
        if (!req.body.username || !req.body.password) {
            res.status(401).json({success: false, msg: 'Please pass username and password.'});
        } else {            
            try {
                var newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                    fullname: req.body.fullname,
                    email: req.body.email, 
                    role: req.body.role
                });
                let user = await User.create(newUser);
                if(req.body.role == "Student"){
                    Student.create({user: user._id}, (err, data)=>{
                        res.status(201).json({success: true, msg: 'Successful created new student.'});
                    })
                }
                if(req.body.role == "Teacher"){
                    Teacher.create({user: user._id}, (err, data)=>{
                        res.status(201).json({success: true, msg: 'Successful created new teacher.'});
                    })
                }
                // res.status(201).json({success: true, msg: 'Successful created new admin.'});
            } catch (error) {
                return res.status(400).json({success: false, msg: 'Username already exists.'});
            }
        }
    },
    SignIn: (req, res) => {
        User.findOne({
          username: req.body.username
        }, function(err, user) {
            if (err) throw err;
        
            if (!user) {
                res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                    });
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
                });
            }
        });
    },
    LogOut: function(req, res) {
        req.logout();
        res.json({success: true, msg: 'Sign out successfully.'});
    },
    forgotPassword: async (req, res)=>{
        // res.json({msg:req.user});
        try {
            var token = jwt.sign({ data: req.body.email }, config.secret, {expiresIn: 300}); // 5 minutes
            await User.findOneAndUpdate({email: req.body.email}, {currentToken: token});
        } catch (error) {
            console.log(err.message);
        }
        var transporter =  nodemailer.createTransport({ // config mail server
            service: 'Gmail',
            auth: {
                user: 'cskh.sanda.asia@gmail.com',
                pass: 'LeThiMyHanh'
            }
        });
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Sanda.asia',
            to: req.body.email,
            subject: `Reset password for user ${req.body.email}`,
            text: 'Reset password for you ',
            html: `<a hrel="http://localhost:3000/api/resetPassword/${token}"> Tại đây! </a>`
        }
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' +  info.response);
                res.status(201).json({
                    msg: info.response,
                    token: token
                });
            }
        });

    },
    resetPassword: async (req, res) => {
        
        let token = req.params.token || null;
        try {
            var decode = jwt.verify(token, config.secret);
        } catch (error) {
            res.status(401).json({
                success: false,
                msg: "Unauthorzition"
            })
        }
        // res.send(decode)
        User.findOne({email: decode.data}, (err, user)=>{
            
            if(user.currentToken != token){
                res.status(401).json({
                    success: false,
                    msg: "Token is wrong!"
                })
            } else{
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        return next(err);
                    }
                    bcrypt.hash(req.body.password, salt, null, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        User.findOneAndUpdate({_id: user._id},{password: hash}, (err, data)=>{
                            if(err){
                                res.status(500).json({
                                    msg: err.message
                                })
                            }
                            res.status(200).json({
                                success: true,
                                msg: "Password was changed"
                            })
                        })
                    });
                });
            }
        })
        
    }
}