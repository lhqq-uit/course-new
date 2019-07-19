const router = require("express").Router();

const courseRouter = require("./course")
const rootRouter = require("./root")
const studentRouter = require("./student")
const teacherRouter = require("./teacher")
const userRouter = require("./users")


router.use("/", rootRouter)
// router.use("/course", courseRouter)
// router.use("/student", studentRouter)
router.use("/teacher", teacherRouter)
// router.use("/user", userRouter)


module.exports = router;