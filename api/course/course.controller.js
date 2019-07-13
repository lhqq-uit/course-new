const Course = require('./course.model')
const Teacher = require('./../teacher/teacher.model')

module.exports = {
   create: async (req, res) =>{
      try{
         let newCourse = {
            name: req.body.name,
            topic: req.body.topic,
            description: req.body.description,
            price: req.body.price,
            total_time: req.body.total_time,
            level: req.body.level,
            teacher: req.user.data._id
         }
         let course = await Course.create(newCourse)
         await Teacher.findOneAndUpdate(
            {user: course.teacher},
            {$push: {courses: course._id}}
         );
         res.status(201).json(course);
         }
         catch{
            res.status(500).send('There was a problem adding the information to the database.');
         }
      }
   }