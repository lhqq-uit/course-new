let router = require('express').Router();

let usersRouter = require('./users/users.routes')
let courseRouter = require('./course/course.routes')

router.use('/', usersRouter);
router.use('/course', courseRouter);

module.exports = router;