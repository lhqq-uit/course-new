var mongoose=require("mongoose")

var CommentSchema = mongoose.Schema({
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
   },
   time: Date,
   content:String,
   reply: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
   }
})

module.exports = mongoose.model('Comment', CommentSchema);
