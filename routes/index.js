const router = require("express").Router();

const courseRouter = require("./course")
const rootRouter = require("./root")
const studentRouter = require("./student")
const teacherRouter = require("./teacher")
const userRouter = require("./users")
const lessonRouter = require("./lesson")


router.use("/user", userRouter)
router.use("/", rootRouter)
router.use("/course", courseRouter)
router.use("/lesson", lessonRouter)
router.use("/student", studentRouter)
router.use("/teacher", teacherRouter)


module.exports = router;