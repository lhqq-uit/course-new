const router = require('express').Router();

const usersRouter = require('./users/users.routes')
const teacherRouter = require('./teacher/teacher.routes')
const courseRouter = require('./course/course.routes')

router.use('/', usersRouter);
router.use('/teacher', teacherRouter);
router.use('/course', courseRouter);

module.exports = router;