var express = require("express");
var router = express.Router();
var Course = require("../api/course/course.model");
var Teacher = require("../api/teacher/teacher.model");
var Student = require("../api/student/student.model");
var config = require("../config/database");
var jwtDecode = require("jwt-decode");

/* GET users listing. */
router.get("/", usedAdmin, async function(req, res) {
  try {
    let user = req.user;
    let total_course = await Course.countDocuments();
    let total_teacher = await Teacher.countDocuments();
    let total_student = await Student.countDocuments();

    let teacher = await Teacher.find({});
    let income = teacher.map(item => item.salary).reduce((a, b) => a + b);
    res.render("admin/index", {
      user,
      total_course,
      total_teacher,
      total_student,
      income: (income * 3) / 7
    });
  } catch (error) {
    res.status(500).send({ err_msg: error.message });
  }
});

/* GET users listing. */
router.get("/course", usedAdmin, async function(req, res) {
  try {
    let user = req.user;
    let data = await Course.find().populate({
      path: "teacher",
      select: "fullname"
    });
    res.render("admin/course", { user, courses: data });
  } catch (error) {
    res.status(500).send({ err_msg: error.message });
  }
});

/* GET users listing. */
router.get("/student", usedAdmin, async function(req, res) {
  try {
    let user = req.user;
    let students = await Student.find().populate("user");
    res.render("admin/student", {
      user,
      students,
      err: req.flash("err"),
      success: req.flash("success")
    });
  } catch (error) {
    res.status(500).send({ err_msg: error.message });
  }
});

/* GET users listing. */
router.get("/teacher", usedAdmin, async function(req, res) {
  try {
    let user = req.user;
    let teachers = await Teacher.find().populate("user");
    res.render("admin/teacher", { user, teachers });
  } catch (error) {
    res.status(500).send({ err_msg: error.message });
  }
});

router.post("/charge/:idUser", usedAdmin, async function(req, res) {
  try {
    let student = await Student.findOne({
      user: req.params.idUser
    }).select("courses.id_course");
    let listIdCoursePurchased = [];
    for (let i = 0; i < student.courses.length; i++) {
      listIdCoursePurchased.push(student.courses[i].id_course.toString());
    }
    if (listIdCoursePurchased.includes(req.body.idCourse)) {
      req.flash("err", "Student bought the course!");
      res.redirect("/admin/student");
    }

    let course = await Course.findById(req.body.idCourse);
    await Course.findByIdAndUpdate(req.body.idCourse, {
      $inc: { students_enrolled: +1 }
    });
    let course_purchased = {
      id_course: req.body.idCourse
    };
    await Student.findOneAndUpdate(
      { user: req.params.idUser },
      {
        $push: { courses: course_purchased }
      }
    );
    let transaction = {
      course: course._id,
      date_trading: new Date().toLocaleDateString(),
      value: course.price
    };
    await Teacher.findOneAndUpdate(
      {
        user: course.teacher
      },
      {
        $inc: {
          salary: +(course.price * 0.7)
        },
        $push: {
          transaction: transaction
        }
      }
    );
    // 30% for admin
    req.flash("success", "Buy course successfully!");
    res.redirect("/admin/student");
  } catch (error) {
    res.status(500).send({ err_msg: error.message });
  }
});

function usedAdmin(req, res, next) {
  if (req.session.token) {
    let decode = jwtDecode(req.session.token);
    if (decode.role == "Admin") {
      req.user = decode;
      next();
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}
module.exports = router;
