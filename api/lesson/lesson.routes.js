const passport = require('passport');
require('../../config/passport')(passport);
const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const multer = require('multer')
const checkPermission = require('../../helper/CheckPermission');
var storage =   multer.diskStorage({
    // file upload destination
    destination: function (req, file, callback) {
        console.log(file.fieldname)
        if(file.fieldname == "video"){
            callback(null, './public/upload/video/');
        } else{
            callback(null, './public/upload/document/');
        }
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname);
    }
  });
  var upload = multer({ storage : storage}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'document', maxCount: 10 }
  ])

//   var uploadFnct = function(dest){
//     var storage = multer.diskStorage({ //multers disk storage settings
//         destination: function (req, file, cb) {
//             // cb(null, './public/upload/'+dest+'/');
//             if(req.files.fields == "video"){
//                 cb(null, './public/upload/'+dest+'/');
//             }
//         },
//         filename: function (req, file, callback) {
//             callback(null, Date.now() + '-' + file.originalname);
//         }
//     });
 

//     var upload = multer({ //multer settings
//                     storage: storage
//                 }).fields([
//                     { name: 'video', maxCount: 1 },
//                     { name: 'document', maxCount: 10 }
//                   ])

//     return upload;
// };
//   var upload = multer({ storage : storage});

//create lesson
router.post('/:idCourse/',  passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, upload, lessonController.create);

//update lesson
router.put('/:idLesson', passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, upload, lessonController.update);

//get a lesson
router.get('/:idLesson', lessonController.getOneLesson);

//get all lesson
router.get('/',lessonController.getAllLesson);

//delete lesson
router.delete('/:idLesson', passport.authenticate('jwt', { session: false}), checkPermission.isTeacher, lessonController.delete);
module.exports = router;