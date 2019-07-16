let Teacher = require('./teacher.model');

module.exports = {
   getTransactionOneDay: async (req, res) => {
      try{
         let a = await Teacher.findOne({user: req.user.data._id}).select('transaction -_id')
         let data = [];
         let sum = 0;
         for(i = 0; i< a.transaction.length; i++ ){
            if(a.transaction[i].date_trading == req.params.timedate.replace(new RegExp('-', 'g'), '/')){
               data.push(a.transaction[i])
               sum += a.transaction[i].value
            }
         }
         res.status(200).json({transaction: data, value: sum});
      }
      catch(err) {
         res.status(500).json({err_msg: err.mesage})
      }
   },
   getTeacher: async (req, res) => {
      try {
         let teacher = await Teacher.findOne({user: req.params.idTeacher})
                                    .populate('user')
                                    .select('-_id')
         if(!teacher) return  res.status(404).json({err_msg: 'Teacher not found'})
         res.status(200).json(teacher)
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   },
   getAllCoureseOfTeacher: async (req, res) => {
      try {
         let teacher = await Teacher.findOne({user:req.params.idTeacher})
                                    .populate('courses')
                                    .select('courses')
         if(!teacher) return  res.status(404).json({err_msg: 'Teacher not found'})
         res.status(200).json(teacher)
      } catch (error) {
         res.status(500).json({err_msg: error.message})
      }
   }
}