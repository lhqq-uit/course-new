const Course = require('./course.model')
const Teacher = require('./../teacher/teacher.model')
const fs = require('fs');

module.exports = {
    create: async (req, res) => {
        try {
            if (!req.files) {
                return res.send({
                    err_msg: 'No file received'
                });
            }
            //each tag separated by comma, remove space in array
            let tag = [] || req.body.tag.split(',').map(s => s.trim());
            let newCourse = {
                name: req.body.name,
                topic: req.body.topic,
                description: req.body.description,
                trailer: req.files.trailer[0].filename,
                price: req.body.price,
                tag: tag,
                sale: req.body.sale,
                // total_time: req.body.total_time,
                level: req.body.level,
                teacher: req.user.data._id,
                avatar: req.files.image[0].filename,
            }
            let course = await Course.create(newCourse)
            await Teacher.findOneAndUpdate(
                { user: course.teacher },
                {
                    $push: { courses: course._id },
                    $inc: { iq: +100 }
                }
            );
            res.status(201).json(course);
        }
        catch (error) {
            if (error && error.name === 'ValidationError') {
                let err_msg = error.message.toString().replace('Course validation failed: ', '').split(', ')
                return res.status(400).json({
                    success: false,
                    err_msg: err_msg
                });
            }
            res.status(500).json(error.message);
        }
    },

    update: async (req, res) => {
        try {
            let tag = [] || req.body.tag.split(',').map(s => s.trim());
            let newCourse = {
                name: req.body.name,
                topic: req.body.topic,
                trailer: req.files.trailer[0].filename,
                description: req.body.description,
                price: req.body.price,
                total_time: req.body.total_time,
                level: req.body.level,
                tag: tag,
                sale: req.body.sale,
                last_update: Date.now(),
                avatar: req.files.image[0].filename,
            }
            let course = await Course.findOneAndUpdate(
                {
                    _id: req.params.idCourse,
                    teacher: req.user.data._id
                },
                newCourse
            );
            if (!course) return res.status(404).send({
                err_message: 'No course found or you are not author of course'
            });
            fs.unlinkSync(`./public/upload/images/${course.avatar}`);
            res.status(200).json({ message: 'Update successfully!' });
        }
        catch{
            res.status(500).send({ err_msg: error.message });
        }
    },

    getOneCourse: async (req, res) => {
        try {
            let course = await Course.findById(req.params.idCourse).populate("lessons").populate("teacher");
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: 'No course found' })
        }
    },
    getAllCourse: async (req, res) => {
        try {
            let all = await Course.find().populate({
                path: "teacher",
                select: "fullname"
            })
            res.status(200).json(all);
        } catch (error) {
            res.status(500).send({ err_msg: error.message });
        }

    },

    delete: async (req, res) => {
        try {
            let numberStudentOfCourse = await Course.findOne({
                _id: req.params.idCourse,
                teacher: req.user.data._id
            }).select("students_enrolled");

            if (numberStudentOfCourse != 0) {
                res.status(400).json({
                    err_message: "you can delete course has student that joining"
                });
            } else {
                let course = await Course.findOneAndDelete({
                    _id: req.params.idCourse,
                    teacher: req.user.data._id
                });
                if (!course) return res.status(404).json({
                    err_message: 'No course found or you are not author of course'
                })
                await Teacher.findOneAndUpdate(
                    { user: req.user.data._id },
                    {
                        $pull: { courses: req.params.idCourse },
                        $inc: { iq: -100 }           //delete course -100 IQ
                    }
                );
                fs.unlinkSync(`./public/upload/images/${course.avatar}`);
                res.status(200).json('Delete successfully!')
            }

        } catch (error) {
            res.status(500).json({ err_msg: error.message })
        }
    },

    getCoursePopulate: async (req, res) => {
        try {
            let courses = await Course.find({})
                .populate("teacher")
                .sort({ "students_enrolled": -1 })
                .limit(8)
            if (!courses) return res.status(400).json({ err_message: 'Course not found!' })
            res.status(200).json(courses)
        } catch (error) {
            res.status(500).json({ err_msg: error.message })
        }
    },

    ratingCourse: async (req, res) => {
        try {
            await Course.findByIdAndUpdate(
                req.params.idCourse,
                { $push: { ratings: req.body.rate } }
            )
            res.status(200).json({ message: 'Rating for course successfully', success: true })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getRatingCourse: async (req, res) => {
        try {
            let course = await Course.findById(req.params.idCourse).select('ratings')
            let course_rating = course.ratings;
            let sum, avg = 0;
            if (course_rating.length) {
                sum = course_rating.reduce(function (a, b) { return a + b; });
                avg = sum / course_rating.length;
            }
            res.json({ 'ratings': avg })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getPriceAfterSale: async (req, res) => {
        try {
            let course = await Course.findById(req.params.idCourse);
            price = course.price - course.price * course.sale / 100;
            if (price === 0) return res.status(200).json({ message: 'Course not sale' })
            res.status(200).json({ 'price': price })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    searchCourse: async (req, res) => {
        const search = req.query.search;
        console.log("TCL: search", search)
        let regexPattern = new RegExp(".*" + search + ".*", "i");
        try {
            course = await Course.find({
                $or: [
                    'name', 'topic', 'description', 'tag'
                ].map(key => ({
                    [key]: {
                        $regex: regexPattern
                    }
                }))
            })
                .populate({
                    path: "teacher",
                    select: "fullname"
                })
                .limit(40)
            console.log("TCL: teacher", course)
            if (course.length === 0) return res.status(404).json({ message: 'No course found' })
            res.status(200).json({ data: course })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
