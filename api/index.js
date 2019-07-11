let router = require('express').Router();

let usersRouter = require('./users/users.routes')

router.use('/', usersRouter);

module.exports = router;