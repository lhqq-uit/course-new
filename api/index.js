const router = require('express').Router();

const usersRouter = require('./users/users.routes')
const teacherRouter = require('./teacher/teacher.routes')
const courseRouter = require('./course/course.routes')
const lessonRouter = require('./lesson/lesson.routes')
const quizRouter = require('./quiz/quiz.routes')
const commentRouter = require('./comment/comment.routes')

router.use('/', usersRouter);
router.use('/teacher', teacherRouter);
router.use('/course', courseRouter);
router.use('/lesson', lessonRouter);
router.use('/quiz', quizRouter);
router.use('/comment', commentRouter);


module.exports = router;