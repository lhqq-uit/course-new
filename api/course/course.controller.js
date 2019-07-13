const Course = require('./course.model')

module.exports = {
   Create: (req, res) =>{
      let newCourse = {
         name: req.body.name,
         topic: req.body.name,
         description: req.body.description,
         price: req.body.price,
         total_time: String,
         level: req.body.level,
         number_lession: req.body.number_lession,
         avatar: req.file.filename,
         teacher: req.user.data._id,
      }
      Course.create({newCourse},function(err, course){
         if(err) return res.status(500).send("There was a problem adding the information to the database.");
         res.status(200).json(course);
      });
   }
}