const Course = require('./../course/course.model')
const Teacher = require('./../teacher/teacher.model')
const Lesson = require('./lesson.model')
const fs = require('fs')

module.exports ={
    create: async (req,res)=> {
        try {

            let list_document=[];
            for(i=0;i<req.files.document.length;i++){
                list_document.push(req.files.document[i].filename);
            }
            let newLesson ={
                title: req.body.title,
                desciption: req.body.description,
                video: req.files.video[0].filename,
                document: list_document,
                course: req.params.idCourse
            }
            // res.send(newLesson)
            let lesson= await Lesson.create(newLesson)
            //console.log(lesson)
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
            // if(!req.file){
            //     return res.send({
            //         message: 'No document received'
            //       });
            // }
            // let lessonOld = await Lesson.findById(req.params.idLesson);
            // console.log(lessonOld)
            // fs.unlinkSync(`http://localhost:3000/upload/video/1563208898066-index-2.html`);
            // res.send("hello")
            // let list_document=[];
            // for(i=0;i<req.files.document.length;i++){
                
            //     list_document.push(req.files.document[i].filename);
            // }
            // console.log(list_document)
            let newLesson = {
                title: req.body.title,
                desciption: req.body.description,
                // video: req.files.video[0].filename,
                // document: list_document
            };

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