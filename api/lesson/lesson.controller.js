const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Lesson = require('./lesson.model')

module.exports ={
    create: async (req,res)=> {
        try {
            let newLesson ={
                title: req.body.title,
                desciption: req.body.description,
                //document: req.file.filename,
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
    },
    update: async (req,res) => {
        try {
            let newLesson = {
                title: req.body.title,
                desciption: req.body.description,
                //document: req.file.filename,
            }

            let lesson = await Lesson.findByIdAndUpdate(req.params.idLesson,newLesson);
            // let lesson = await Lesson.findOneAndUpdate({_id: req.params.idLesson}, newLesson);
            if(!lesson) return res.status(404).send('No course found or you are not author of lesson');
            console.log(lesson)
            res.status(201).json({
                success: true,
                msg : "Success update a lesson",
                data: newLesson
            })
        } catch (error) {
            res.status(500).send('There was a problem updating the information to the database.')
        }
    },
    getOneLesson: async (req, res) => {
        try {
            let lesson = await Lesson.findById(req.params.idLesson)
            res.status(201).json({
                success: true,
                msg: "Success get a lesson",
                data: lesson
            })
        } catch (error) {
            res.status(404).json({message: 'No lesson found'})
        }
    },
    getAllLesson : async (req, res) => {
        let lesson = await Lesson.find({},(err, data)=>{
            if(err) return res.status(404).send('No lesson found');
            res.status(201).json({
                success: true,
                msg: "Success get all lesson",
                data: lesson
            });
         });
    },
    delete : async (req, res) => {
        try {
            let lesson = await Lesson.findByIdAndDelete(
                {
                    _id: req.params.idLesson
                }
            );
            //if(!lesson) return res.status(404).json('No course found or you are not author of lesson');
    
            await Course.findOneAndUpdate(
                {
                    lesson: req.params.idLesson
                },
                {
                    $pull: {lessons:req.params.idLesson}
                }
            );
    
            await Teacher.findOneAndUpdate(
                {
                    user: req.user.data._id
                },
                {
                    $inc: {iq: -100}
                }
            );
    

            
            res.status(201).json({
                success: true,
                msg: "Success delete a lesson",
            })
        } catch (error) {
            res.status(500).json('There was a problem deleting the information to the database.')
        }
    }
}