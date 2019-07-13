const Lesson = require('./../lesson/lesson.model')
const Student = require('./../student/student.model')
const Quiz = require('./quiz.model')


module.exports={
    create: async(req,res)=>{
        try {
            let newQuiz={
                question: req.body.question,
                list_answer: req.body.list_answer,
                result: req.body.result
            }
            
            let quiz= await Quiz.create(newQuiz)

            await Lesson.findOneAndUpdate(
                {
                    _id: req.params.idLesson
                },
                {
                    $push: {quizzes: quiz._id}
                }
            )
            res.status(201).json({
                success: true,
                msg : "Success create a quiz",
                data: quiz
            })
        } catch (error) {
            res.status(500).send('There was a problem adding the information to the database.')
        }
    }
}