var mongoose=require("mongoose");

var commentSchema = mongoose.Schema({
  username:String,
  text:String
});

module.exports = mongoose.model("Comment", commentSchema);