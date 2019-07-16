let Teacher = require('./teacher.model');

module.exports = {
   getTransactionOneDay: async (req, res) => {
      let a = await Teacher.findOne({user: req.user.data._id}).select('transaction -_id')
      let data = [];
      let sum = 0;
      for(i = 0; i< a.transaction.length; i++ ){
         if(a.transaction[i].date_trading == req.params.timedate.replace(new RegExp('-', 'g'), '/')){
            data.push(a.transaction[i])
            sum += a.transaction[i].value
         }
      }
      res.json({transaction: data, value: sum});
      // console.log(grouped);
   }
}