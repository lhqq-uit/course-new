const Course = require('./course.model')
const Teacher = require('./../teacher/teacher.model')

module.exports = {
   create: async (req, res) =>{
      try{
         // if (!req.file) {
         //    return res.send({
         //      message: 'No image received'
         //    });
         // }
         let newCourse = {
            name: req.body.name,
            topic: req.body.topic,
            description: req.body.description,
            price: req.body.price,
            total_time: req.body.total_time,
            level: req.body.level,
            teacher: req.user.data._id,
            avatar: req.file.filename,
         }
         let course = await Course.create(newCourse)
         await Teacher.findOneAndUpdate(
            {user: course.teacher},
            {
               $push: {courses: course._id},
               $inc: {iq: +100}
            }
         );
         res.status(201).json(course);
      }
      catch{
         res.status(500).send('There was a problem adding the information to the database.');
      }
   },
   update: async (req, res) => {
      try{
         let newCourse = {
            name: req.body.name,
            topic: req.body.topic,
            description: req.body.description,
            price: req.body.price,
            total_time: req.body.total_time,
            level: req.body.level,
            last_update: Date.now()
            // avatar: req.file.filename,
         }
         let course = await Course.findOneAndUpdate(
            {_id: req.params.id,
             teacher: req.user.data._id},
            newCourse
         );
         if(!course) return res.status(404).send('No course found or you are not author of course');
         res.status(200).json({message: 'Update successfully!'});
      }
      catch{
         res.status(500).send('There was a problem adding the information to the database.');
      }
   },
   getOneCourse: async (req, res) => {
      try {
         let course = await Course.findById(req.params.id);
         res.status(200).json(course);
      } catch (error) {
         res.status(404).json({message: 'No course found'})
      }
   },
   getAllCourse: (req, res) => {
      Course.find({},(err, data)=>{
         if(err) return res.status(500).send('There was a problem adding the information to the database.');
         res.status(200).json(data);
      });
   },
   delete: async (req, res) => {
      try {
         let course = await Course.findOneAndDelete({
            _id: req.params.id, 
            teacher: req.user.data._id
         });
         if(!course) return res.status(404).json('No course found or you are not author of course')
         await Teacher.findOneAndUpdate(
            {user: req.user.data._id},
            {
               $pull: {courses: req.params.id},
               $inc: {iq: -100}           //delete course -100 IQ
            }
         );
         res.status(200).json('Delete successfully!')
      } catch (error) {
         res.status(500).json('There was a problem adding the information to the database.')
      }
   }
}