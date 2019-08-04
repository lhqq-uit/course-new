const express = require('express');
const router = express.Router();
const domain = require('./../config/domain')
const jwtDecode = require('jwt-decode');
const axios = require('axios')
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var keys = require("./../config/key")


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/return'
},
    function (accessToken, refreshToken, profile, cb) {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }));

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
        // accessToken => {
        //     console.log(accessToken);
        // }
        (accessToken, refreshToken, profile, cb) => {
            return cb(null, profile);
        }
    )
);
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


//todo: login with google
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    async (req, res) => {
        await axios({
            method: "get",
            url: `${domain}/api/usCheck/${req.user.id}`
        }).then(response => {
            if (response.data.checkUser == false) {
                axios({
                    method: 'post',
                    url: `${domain}/api/signup`,
                    data: {
                        //     idUserGG: req.user.id,
                        //     fullname: req.user.displayName,
                        //     avatar: req.user._json.picture,
                        //     email: req.user._json.email,
                        fullname: req.user.displayName,
                        username: req.user.id,
                        email: req.user._json.email,
                        password: req.user.id,
                        //avatar: req.user._json.picture,
                        role: "Student"
                    }
                }).catch(err => {
                    console.log(err)
                    res.redirect("/login")
                })
            }
        }).catch(err => {
            console.log(err)
        })
            .finally(async () => {
                await axios({
                    method: 'post',
                    url: `${domain}/api/signin`,
                    data: {
                        username: req.user.id,
                        password: req.user.id
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
            })
        //res.redirect('/authentication'); //TODO: return authentication
        // res.json({
        //     idUserGG: req.user.id,
        //     fullname: req.user.displayName,
        //     avatar: req.user._json.picture,
        //     email: req.user._json.email,
        //     //user: req.user
        // });
    });



//TODO: login with facebook
router.get('/login/facebook',
    passport.authenticate('facebook'));

router.get('/return',
    passport.authenticate('facebook', {
        failureRedirect: '/login' //TODO: retutrn login if fail
    }),
    function (req, res) {
        res.redirect('/authentication'); //TODO: return authentication
    });

router.get('/authentication',
    require('connect-ensure-login').ensureLoggedIn(),
    async (req, res) => {
        // let checkUser = '';
        await axios({
            method: "get",
            url: `${domain}/api/usCheck/${req.user.id}`
        }).then(response => {
            if (response.data.checkUser == false) {
                axios({
                    method: 'post',
                    url: `${domain}/api/signup`,
                    data: {
                        fullname: req.user.displayName,
                        username: req.user.id,
                        email: `${req.user.id}112@student.com`,
                        password: req.user.id,
                        role: "Student"
                    }
                }).catch(err => {
                    console.log(err)
                    res.redirect("/login")
                })
            }
        }).catch(err => {
            console.log(err)
        })
            .finally(async () => {
                await axios({
                    method: 'post',
                    url: `${domain}/api/signin`,
                    data: {
                        username: req.user.id,
                        password: req.user.id
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
            })
        // if (checkUser == false) {

        // } else {
        //     axios({
        //         method: 'post',
        //         url: `${domain}/api/signin`,
        //         data: {
        //             username: req.user.id,
        //             password: req.user.id
        //         }
        //     }).then(Response => {
        //         req.session.token = Response.data.token;
        //         //console.log(req.session.token)
        //         // console.log()
        //         if (req.session.token) {
        //             res.redirect('/dashboard')
        //         }

        //     }).catch(err => {
        //         //console.log(err)
        //         if (err.response.data.success == false) {
        //             req.session.catchLogin = false;
        //             res.redirect("/login");
        //         }
        //     })
        // }
        //console.log(req.user)
        // res.json({
        //     user: req.user,
        //     id: req.user.id,
        //     name: req.user.displayName,
        //     check: checkUser
        // })
    });

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


router.post("/:idLesson", (req, res) => {
    let getInfo = jwtDecode(req.session.token);
    console.log(getInfo)
    axios({
        method: "post",
        url: `${domain}/api/comment/${req.params.idLesson}/${getInfo._id}`,
        data: {
            content: req.body.content
        },
        headers: {
            Authorization: req.session.token
        }
    }).then(r => {
        if (r.data.success == true) {
            res.redirect(`/lesson/${req.params.idLesson}`)
        }
    }).catch(err => {
        console.log(err)
    })
})

router.post("/:idCMT/:idLesson", (req, res) => {
    let getInfo = jwtDecode(req.session.token);
    console.log(getInfo)
    axios({
        method: "post",
        url: `${domain}/api/comment/child/${req.params.idCMT}/${getInfo._id}`,
        data: {
            content: req.body.contentReply
        },
        headers: {
            Authorization: req.session.token
        }
    }).then(r => {
        if (r.data.success == true) {
            res.redirect(`/lesson/${req.params.idLesson}`)
        }
    }).catch(err => {
        console.log(err)
    })
})

router.post("/delete/:idLesson/:idComment", async (req, res) => {
    let getInfo = jwtDecode(req.session.token);
    console.log(getInfo)
    let url = `${domain}/api/comment/delete/${req.params.idLesson}/${req.params.idComment}`;
    console.log(url);
    await axios({
        method: "delete",
        baseURL: url,
        headers: {
            Authorization: req.session.token
        }
    }).then(r => {
        if (r.data.success == true) {
            res.redirect(`/lesson/${req.params.idLesson}`)
        }
    }).catch(err => {
        console.log(err)
    })
})

router.post("/delete/child/:idLesson/:idCommentParent/:idCommentChild", async (req, res) => {
    let getInfo = jwtDecode(req.session.token);
    console.log(getInfo)
    let url = `${domain}/api/comment/child/delete/${req.params.idCommentParent}/${req.params.idCommentChild}`;
    console.log(url);
    await axios({
        method: "delete",
        baseURL: url,
        headers: {
            Authorization: req.session.token
        }
    }).then(r => {
        if (r.data.success == true) {
            res.redirect(`/lesson/${req.params.idLesson}`)
        }
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;