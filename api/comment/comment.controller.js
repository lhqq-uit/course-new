const User = require('./../users/users.model')
const Comment = require('./comment.model')
const Lesson = require('./../lesson/lesson.model')
const Teacher = require('./../teacher/teacher.model');
const Course = require("./../course/course.model")

module.exports = {
  // ? Parent
  create: async (req, res) => {
    //TODO: Create a Comment
    try {
      //TODO: Validate request
      if (!req.body.content) {
        return res.status(400).send({
          message: "Comment can not be empty"
        })
      }

      let newComment = {
        user: req.user._id,
        time: Date.now(),
        content: req.body.content,
      }
      let comment = await Comment.create(newComment)

      await Lesson.findOneAndUpdate({
        _id: req.params.idLesson
      }, {
          $push: {
            comment: comment._id
          }
        })

      res.status(201).json({
        success: true,
        msg: "Success create a Comment",
        data: comment
      })
    } catch (error) { //TODO: Show error
      if (error && error.name === 'ValidationError') {
        let err_msg = error.message.toString().replace('Lesson validation failed: ', '').split(', ')
        return res.status(400).json({
          success: false,
          err_msg: err_msg
        });
      }
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Comment.",
        // //iduser: req.user._id,
        // idLesson1: req.params.idLesson,
        // content1: req.body.content,
      })
    }
  },
  delete: async (req, res) => {
    try {
      await Lesson.update({
        _id: req.params.idLesson
      }, {
          $pull: {
            comment: req.params.idComment
          }
        }, {
          multi: true
        });
      let getData = await Comment.findById(
        req.params.idComment
      ).select("reply -_id");


      await Comment.remove({
        '_id': {
          '$in': getData.reply
        }
      }, (err) => {
        if (err) {
          err.message || "Some thing err"
        }
      })

      await Comment.findByIdAndDelete({
        _id: req.params.idComment
      }, (err) => {
        if (err) {
          err.message || "Some thing err"
        }
      });

      res.status(201).json({
        success: true,
        msg: "Success delete a Comment",
        // data: result
      })

    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while deleting the Comment."
      })
    }
  },
  update: async (req, res) => {
    //TODO: Update a Comment
    try {
      //TODO: Validate request
      if (!req.body.content) {
        return res.status(400).send({
          message: "Comment can not be empty"
        })
      }
      let result = await Comment.findOneAndUpdate({
        _id: req.params.idComment,
        user: req.user._id
      }, {
          content: req.body.content
        });
      if (!result) {
        return res.status(404).json({
          message: "You not a author or Comment not find"
        })
      }
      res.status(201).json({
        success: true,
        msg: "Success update a Comment",
        data: result
      });
    } catch (error) { //TODO: Show error
      res.status(500).send({
        message: error.message || "Some error occurred while updating the Comment."
      })
    }
  },
  createChild: async (req, res) => {
    //TODO: Create a Comment
    try {
      //TODO: Validate request
      if (!req.body.content) {
        return res.status(400).send({
          message: "Comment can not be empty"
        })
      }
      let newComment = {
        user: req.user._id,
        time: Date.now(),
        content: req.body.content,
      }
      let comment = await Comment.create(newComment);

      await Comment.findOneAndUpdate({
        _id: req.params.idCommentParent
      }, {
          $push: {
            reply: comment._id
          }
        })

      res.status(201).json({
        success: true,
        msg: "Success create a Comment Child",
        data: comment
      })
    } catch (error) { //TODO: Show error
      res.status(500).send({
        message: error.message || "Some error occurred while creating the Comment Child."
      })
    }
  },
  deleteChild: async (req, res) => {
    try {
      await Comment.update({
        _id: req.params.idCommentParent
      }, {
          $pull: {
            reply: req.params.idCommentChild
          }
        }, {
          multi: true
        });
      await Comment.findByIdAndDelete({
        _id: req.params.idCommentChild
      })
      res.status(201).json({
        success: true,
        msg: "Success delete a comment child",
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while Deleting the Comment Child."
      })
    }
  },
  getOneComment: async (req, res) => {
    try {
      let oneComment = await Comment.findById(req.params.idComment);
      res.status(201).json({
        success: true,
        msg: "Get one comment success",
        data: oneComment,
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while get the comment."
      })
    }
  },
  getAllComment: async (_req, res) => {
    try {
      let allComment = await Comment.find();
      res.status(201).json({
        success: true,
        msg: "Get all comment success",
        data: allComment,
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while get all the comment."
      })
    }
  },
  getAllCommentOfLesson: async (req, res) => {
    try {
      let getData = await Lesson.findById(
        req.params.idLesson
      ).select("comment -_id");
      //res.json(getData);
      let getAllCommentOfLesson = await Comment.find({
        '_id': {
          '$in': getData.comment
        }
      }).populate('user', 'username role')
      res.status(201).json({
        success: true,
        msg: "Get all comment success",
        data: getAllCommentOfLesson,
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while get all the comment."
      })
    }
  },
  getAllCommentOfCourseByTeacher: async (req, res) => {
    try {
      // let getIdTeacher = await User.findOne({
      //     _id: req.params.idTeacher
      // })
      let getIdCourses = await Teacher.findOne({
        // !user: req.user._id
        //_id: req.user.data._id
        user: req.params.idUser
      })
        // .populate({
        //     path: "courses",
        //     select: "name lessons -_id",
        //     // populate: {
        //     //     path: "lessons",
        //     //     select: "comment -_id",
        //     //     // populate: {
        //     //     //     path: "comment",
        //     //     //     select: "content reply user time -_id",
        //     //     //     options: {
        //     //     //         sort: {
        //     //     //             _id: -1
        //     //     //         }
        //     //     //     },
        //     //     //     populate: {
        //     //     //         path: "reply user",
        //     //     //         select: "content time avatar fullname -_id",
        //     //     //         populate: {
        //     //     //             path: "reply user",
        //     //     //             select: "content time avatar fullname -_id",
        //     //     //         }
        //     //     //     }
        //     //     // }
        //     // }
        // })
        .select("courses -_id")
      let getIdComment = await Lesson.find({
        course: {
          $in: getIdCourses.courses
        }
      })
        // .populate({
        //     path: "comment",
        //     select: "_id",
        //     options: {
        //         sort: {
        //             _id: -1
        //         }
        //     },
        // })
        .select("comment -_id")

      let getArrayIdComment = [];
      getIdComment.forEach(element => {
        for (let i = 0; i < element.comment.length; i++) {
          getArrayIdComment.push(element.comment[i].toString())
        }
      });

      let getCMT = await Comment.find({
        _id: {
          $in: getArrayIdComment
        }
      })
        .populate({
          path: "reply user",
          select: "content time user avatar fullname -_id",
          populate: {
            path: "user",
            select: "fullname avatar -_id"
          }
        })
        .sort({
          _id: -1
        }).select("-_id")

      // let getArrayIdCMT = [];
      // // getIdLesson.forEach(e => {
      // //     getIdCMT.push(e.comment._id.toString())
      // // });
      // let nameCourse = [];

      //getCMT = JSON.stringify(getCMT);
      res.status(201).json({
        //idCourses: getIdCourses || "null",
        //idLesson: getIdLesson || "null",
        //arrayIdComment: getArrayIdComment || "null",
        data: getCMT || "null",
        //IdCMT: getArrayIdCMT || "null",
        // getIdCMT: getIdCMT
        //courses: nameCourse,
        // data2: getIdTeacher
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while get all the comment."
      })
    }
  },
  getAllCommentOfCourseByTeacher1: async (req, res) => {
    try {
      // let getIdTeacher = await User.findOne({
      //     _id: req.params.idTeacher
      // })
      let getIdCourses = await Teacher.findOne({
        // !user: req.user._id
        //_id: req.user.data._id
        user: req.params.idUser
      })
        .populate({
          path: "courses",
          select: "name lessons _id",
          populate: {
            path: "lessons",
            select: "comment title _id",
            populate: {
              path: "comment",
              select: "content reply user time _id",
              options: {
                sort: {
                  _id: -1
                },
              },
              populate: {
                path: "reply user",
                select: "content time avatar fullname _id",
                populate: {
                  path: "reply user",
                  select: "content time avatar fullname _id",
                }
              }
            }
          }
        })
        .select("courses -_id")

      res.status(201).json({
        idCourses: getIdCourses.courses || "null",
        //idLesson: getIdLesson || "null",
        //arrayIdComment: getArrayIdComment || "null",
        //data: getCMT || "null",
        //IdCMT: getArrayIdCMT || "null",
        // getIdCMT: getIdCMT
        //courses: nameCourse,
        // data2: getIdTeacher
      })
    } catch (error) {
      res.status(500).send({
        message: error.message || "Some error occurred while get all the comment."
      })
    }
  }
}
