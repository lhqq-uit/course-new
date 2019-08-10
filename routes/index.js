const router = require("express").Router();

const courseRouter = require("./course")
const rootRouter = require("./root")
const studentRouter = require("./student")
const teacherRouter = require("./teacher")
const userRouter = require("./users")
const lessonRouter = require("./lesson")

router.use("/course", courseRouter)
router.use("/user", userRouter)
router.use("/lesson", lessonRouter)
router.use("/student", studentRouter)
router.use("/teacher", teacherRouter)
router.use("/", rootRouter)

module.exports = router;