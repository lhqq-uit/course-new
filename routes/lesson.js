var express = require('express');
var router = express.Router();
const domain = require('../config/domain');
const axios = require('axios');

/* GET users listing. */
router.get('/:idLesson', async function(req, res, next) {
    let lesson;
    await axios({
            method: 'get',
            url: `${domain}/api/lesson/${req.params.idLesson}`
        }).then(Response => {
            lesson = Response.data.data;
        }).catch(err => {
            console.log(err)
        });

    if(req.session.token){
        res.render("student/student-take-lesson", {lesson});
    } else{
        res.status(403).send('Unauthorized')
    }
});


module.exports = router;
