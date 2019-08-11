const jwt = require("jsonwebtoken");
const config = require("../config/database");
let Teacher = require("../api/teacher/teacher.model");
let Student = require("../api/student/student.model");

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = {
    isAdmin: (req, res, next)=>{
        let token = getToken(req.headers);
        if (token) {
            jwt.verify(token, config.secret, (err, decode)=>{
                if(err){
                    let result = {
                        success: false,
                        msg : err.message
                    };
                    res.status(301).json(result);
                }
                if(decode.role == "Admin"){
                    req.user = {
                        success : true,
                        msg : "login success",
                        data : decode,
                    }
                    next();
                }
                else{
                    return res.status(403).send({success: false, msg: 'Unauthorized.'});
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    },
    isTeacher: (req, res, next)=>{
        let token = getToken(req.headers);
        if (token) {
            jwt.verify(token, config.secret, async (err, decode)=>{
                if(err){
                    let result = {
                        success: false,
                        msg : err.message
                    };
                    res.status(301).json(result);
                } else{
                    if(decode.role == "Teacher"){
                        Teacher.findOne({user: decode._id}, (err, data)=>{
                            if(err){
                                let result = {
                                    success: false,
                                    msg : err.message
                                };
                                res.status(301).json(result);
                            }
                            req.user = {
                                success : true,
                                msg : "login success",
                                data : decode,
                            }
                            next();
                        })
                    }
                    else{
                        return res.status(403).send({success: false, msg: 'Unauthorized.'});
                    }
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    },
    isStudent: (req, res, next)=>{
        let token = getToken(req.headers);
        if (token) {
            jwt.verify(token, config.secret, async (err, decode)=>{
                if(err){
                    let result = {
                        success: false,
                        msg : err.message
                    };
                    res.status(301).json(result);
                } else{
                    if(decode.role == "Student"){
                        
                        Student.findOne({user: decode._id}, (err, data)=>{
                            if(err){
                                let result = {
                                    success: false,
                                    msg : err.message
                                };
                                res.status(301).json(result);
                            }
                            req.user = {
                                success : true,
                                msg : "login success",
                                data : decode,
                            }
                            next();
                        })
                    }
                    else{
                        return res.status(403).send({success: false, msg: 'Unauthorized.'});
                    }
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    },
    usedLogin: (req, res, next)=>{
        let token = getToken(req.headers);
        if (token) {
            jwt.verify(token, config.secret, (err, decode)=>{
                if(err){
                    let result = {
                        success: false,
                        msg : err.message
                    };
                    res.status(301).json(result);
                }
                req.user = {
                    success : true,
                    msg : "login success",
                    data : decode,
                }
                next();
            });
        } else {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
}