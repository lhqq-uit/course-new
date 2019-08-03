let Teacher = require('./teacher.model');

module.exports = {
  getTransactionOneWeek: async (req, res) => {
    try {
      let teacher = await Teacher.findOne({
        user: req.user.data._id
      })
        .populate({
          path: 'transaction.course',
          select: 'avatar name -_id'
        })
        .select('transaction -_id')
      let data = [];
      let valueTransactionsWeek = [];
      let d = new Date();
      for (let i = 0; i < 14; i++) {
        let sumOneDay = 0;
        for (j = 0; j < teacher.transaction.length; j++) {
          if (teacher.transaction[j].date_trading == d.toLocaleString().split(',')[0]) {
            data.push(teacher.transaction[j])
            sumOneDay += teacher.transaction[j].value
          }
        }
        d.setDate(d.getDate() - 1);
        valueTransactionsWeek.push(sumOneDay); //array value current time to old
      } //sort old to current time
      res.status(200).json({
        //data: teacher,
        transaction: data,
        value: valueTransactionsWeek.reverse()
      });
    } catch (err) {
      res.status(500).json({
        err_msg: err.mesage
      })
    }
  },
  getTransactionThisMonth: async (req, res) => {
    try {
      let teacher = await Teacher.findOne({
        user: req.user.data._id
      }).select('transaction -_id')
      let data = [];
      let sum = 0;
      let d = new Date();
      for (i = 0; i < teacher.transaction.length; i++) {
        if (teacher.transaction[i].date_trading.split('/')[0] - 1 === d.getMonth()) {
          data.push(teacher.transaction[i])
          sum += teacher.transaction[i].value
        }
      }
      res.status(200).json({
        transaction: data,
        value: sum
      });
    } catch (err) {
      res.status(500).json({
        err_msg: err.mesage
      })
    }
  },
  getAverageMonthlySalary: async (req, res) => {
    try {
      let teacher = await Teacher.findOne({
        user: req.user.data._id
      });
      let firstTime = teacher.timeCreated;
      let currentTime = new Date
      let numberDay = Math.floor((currentTime - firstTime) / 86400000);
      let avgValue = 0;
      let totalValue = 0;
      let numberDayInMonth = numberDay - currentTime.getDate();
      if (numberDayInMonth < 1)
        return res.status(200).json({ 'Value': avgValue });
      for (i = 0; i < teacher.transaction.length; i++) {
        if (teacher.transaction[i].date_trading.split('/')[0] - 1 < currentTime.getMonth()
          && teacher.transaction[i].date_trading.split('/')[2] <= currentTime.getFullYear()) {
          totalValue += teacher.transaction[i].value
        }
      }
      avgValue = totalValue / numberDayInMonth * 30;
      res.status(200).json({ 'Value': avgValue });
    } catch (err) {
      res.status(500).json({
        err_msg: err.mesage
      })
    }
  },
  getTeacher: async (req, res) => {
    try {
      let teacher = await Teacher.findOne({
        user: req.params.idTeacher
      })
        .populate('user')
        .select('-_id')
      if (!teacher) return res.status(404).json({
        err_msg: 'Teacher not found'
      })
      res.status(200).json(teacher)
    } catch (error) {
      res.status(500).json({
        err_msg: error.message
      })
    }
  },
  getAllCoureseOfTeacher: async (req, res) => {
    try {
      let teacher = await Teacher.findOne({
        user: req.params.idTeacher
      })
        .populate('courses')
        .select('courses')
      if (!teacher) return res.status(404).json({
        err_msg: 'Teacher not found'
      })
      res.status(200).json(teacher)
    } catch (error) {
      res.status(500).json({
        err_msg: error.message
      })
    }
  }
}
