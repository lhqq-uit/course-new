let Teacher = require('./teacher.model');

module.exports = {
    Register: (req, res)=>{
        Teacher.create({user: req.user.data._id}, (err, data)=>{
            if(err){
                res.status(500).json({
                    success: false,
                    msg: err.message
                })
            }
            res.status(201).json({
                success: true,
                msg: `${req.user.data.fullname} had been the teacher`
            })
        })
    }
}