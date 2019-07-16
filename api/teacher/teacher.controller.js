let Teacher = require('./teacher.model');

module.exports = {
   getTransactionOneDay: async (req, res) => {
      // let a = await Teacher.findOne({user: req.user.data._id}).select('transaction -_id')
      // res.json(a);
      let a = await Teacher.findOne({user: req.user.data._id, "transaction.date_trading" : '7/15/2019'}).select('transaction -_id')
      res.json(a);
      console.log(grouped);
   }
}