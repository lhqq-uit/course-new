var express = require("express");
var router = express.Router();
const domain = require("../config/domain");
const axios = require("axios");
const jwtDecode = require("jwt-decode");

/* GET users listing. */
router.get("/:idLesson", async function (req, res, next) {
    let getInfoStudent = jwtDecode(req.session.token);
    console.log(getInfoStudent)
    let lesson;
    await axios({
        method: "get",
        url: `${domain}/api/lesson/${req.params.idLesson}`,
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
    
    await axios({
        method: "get",
        url: `${domain}/api/student/info/${getInfoStudent._id}`,
        //responseType: 'stream'
    })
        .then(response => {
            // handle success
            //console.log(response.data);

            infoStudent = response.data;
        })
        .catch(error => {
            // handle error
            console.log(error);
        });

    if (req.session.token) {
        res.render("student/student-take-lesson", {
            lesson,
            cmt,
            infoStudent,
        });
    } else {
        res.status(403).send("Unauthorized");
    }
});

module.exports = router;
