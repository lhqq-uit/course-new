var express = require("express");
var router = express.Router();
const domain = require("../config/domain");
const axios = require("axios");
const jwtDecode = require("jwt-decode");

/* GET users listing. */
router.get("/:idLesson", async function (req, res, next) {
    if (req.session.token) {

        let lesson;
        await axios({
            method: "get",
            url: `${domain}/api/lesson/${req.params.idLesson}`,
            headers: {
                Authorization: req.session.token
            }
        })
            .then(Response => {
                lesson = Response.data.data;
            })
            .catch(err => {
                console.log(err);
            });
        let cmt;
        await axios({
            method: "get",
            url: `${domain}/api/comment/lesson/${req.params.idLesson}`,
        }).then(response => {
            cmt = response.data.data;
        });
        let getInfoUser = jwtDecode(req.session.token);
        res.render("student/student-take-lesson", {
            lesson,
            cmt,
            infoStudent: getInfoUser,
            idLesson: req.params.idLesson,
            token: req.session.token,
        });
    } else {
        res.status(403).send("Unauthorized");
    }
});

module.exports = router;
