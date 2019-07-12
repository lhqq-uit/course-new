var User = require('./users.model');
var jwt = require('jsonwebtoken');
var config = require('../../config/database');

module.exports = {
    SignUp: (req, res)=>{
        if (!req.body.username || !req.body.password) {
            res.status(401).json({success: false, msg: 'Please pass username and password.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
                if (err) {
                return res.status(400).json({success: false, msg: 'Username already exists.'});
                }
                res.status(201).json({success: true, msg: 'Successful created new user.'});
            });
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
    }
}