var express = require("express");
var router = express.Router();
var Course = require('../api/course/course.model')
var Teacher = require('../api/teacher/teacher.model')
var Student = require('../api/student/student.model')
var config = require('../config/database')
var jwtDecode = require('jwt-decode')

/* GET users listing. */
router.get("/", usedAdmin, async function (req, res) {
    try {
        let user = req.user;
        let total_course = await Course.countDocuments();
        let total_teacher = await Teacher.countDocuments();
        let total_student = await Student.countDocuments();

        let teacher = await Teacher.find({});
        let income = teacher.map(item => item.salary).reduce((a, b) => a + b)
        res.render('admin/index',{user ,total_course, total_teacher, total_student, income: income * 3 / 7});
    } catch (error) {
        res.status(500).send({ err_msg: error.message });
    }
});

/* GET users listing. */
router.get("/course", usedAdmin, async function (req, res) {
    try {
        let user = req.user;
        let data = await Course.find().populate({
            path: "teacher",
            select: "fullname"
        })
        res.render('admin/course',{user, courses: data});
    } catch (error) {
        res.status(500).send({ err_msg: error.message });
    }
});

/* GET users listing. */
router.get("/student", usedAdmin, async function (req, res) {
    try {
        let user = req.user;
        let students = await Student.find().populate("user")
        res.render('admin/student',{user, students});
    } catch (error) {
        res.status(500).send({ err_msg: error.message });
    }
});

/* GET users listing. */
router.get("/teacher", usedAdmin, async function (req, res) {
    try {
        let user = req.user;
        let teachers = await Teacher.find().populate("user")
        res.render('admin/teacher',{user, teachers});
    } catch (error) {
        res.status(500).send({ err_msg: error.message });
    }
});

/* GET users listing. */
router.post("/charge/:idUser", usedAdmin, async function (req, res) {
    try {
        await Student.findOneAndUpdate({user: req.params.idUser},{
            $inc: {
                balance: + req.body.numberPlus
            }
        });
        res.redirect('/admin/student');
    } catch (error) {
        res.status(500).send({ err_msg: error.message });
    }
});

// /* GET users listing. */
// router.get("/setting", usedAdmin, async function (req, res) {
//     res.render('admin/index');
// });

function usedAdmin(req, res, next){
        
    if (req.session.token) {
        let decode = jwtDecode(req.session.token);
        if(decode.role == "Admin"){
            req.user = decode;
            next();
        } else{
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}
module.exports = router;
