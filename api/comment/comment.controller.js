const Course = require('./../course/course.model')
const User = require('./../users/users.model')
const Lesson = require('./lesson.model')

module.exports ={
    create: async (req,res)=> {
        try {

        } catch (error) {
            res.status(500).send('There was a problem adding the information to the database.')
        }
    }
}