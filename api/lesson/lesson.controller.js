const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Lesson = require('./lesson.model')

module.exports ={
    create: async (req,res)=> {
        try {
            let newLesson ={
                title: req.body.title,
                description: req.body.description,
                course: req.params.idCourse
            }

            let lesson= await Lesson.create(newLesson)

            await Course.findOneAndUpdate(
                {
                    _id: req.params.idCourse
                },
                {
                    $push: {lessons: lesson._id}
                }
            )

            await Teacher.findOneAndUpdate(
                {
                    user: req.user.data._id
                },
                {
                    $inc: { iq: +100}
                }
            )

            res.status(201).json({
                success: true,
                msg : "Success create a lesson",
                data: lesson
            })
        } catch (error) {
            res.status(500).send('There was a problem adding the information to the database.')
        }
    }
}