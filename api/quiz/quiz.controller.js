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
    },
    getOneQuiz: async(req, res) => {
        try {
            let quiz= await Quiz.findById(req.params.idQuiz);
            if(!quiz) return res.status(404).send('No quiz found or you are not author of quiz');
            res.status(201).json({
                success: true,
                msg: "Success get a quiz",
                data: quiz
            })
        } catch (error) {
            res.status(404).json({message: 'No quiz found'})
        }
    },
    getAllQuiz: async(req, res) => {
        Quiz.find({},(err, data)=>{
            if(err) return res.status(500).send('There was a problem get all quiz the information to the database.');
            res.status(200).json({
                success: true,
                msg: "Success get all quiz",
                data: data
            });
         });
    },
    delete: async(req,res) => {
        try {
            console.log(req.params.idQuiz)
            let quiz = await Quiz.findByIdAndDelete(
                {
                    _id: req.params.idQuiz
                }
            );
            await Lesson.findOneAndUpdate(
                {
                    quizzes: req.params.idQuiz
                },
                {
                    $pull: {quizzes:req.params.idQuiz}
                }
            );

            // await Student.findOneAndUpdate(
            //     {
            //         quiz: req.params.idQuiz
            //     },
            //     {
            //         $pull: {quiz:req.params.idQuiz}
            //     }
            // );
            res.status(201).json({
                success: true,
                msg: "Success delete a quiz",
            });
        } catch (error) {
            res.status(500).json('There was a problem deleting the quiz to the database.');
        }
    },
    update: async (req, res) => {
        try {
            let newQuiz={
                question: req.body.question,
                list_answer: req.body.list_answer,
                result: req.body.result
            };
            let quiz = await Quiz.findByIdAndUpdate(req.params.idQuiz,newQuiz);
            if(!quiz) return res.status(404).send('No Quiz found or you are not author of quiz');
            res.status(201).json({
                success: true,
                msg : "Success update a quiz",
                data: newQuiz
            });
        } catch (error) {
            res.status(500).send('There was a problem updating the Quiz to the database.')
        }
    }
}