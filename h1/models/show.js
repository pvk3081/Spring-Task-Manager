  var mongoose=require("mongoose");
  var showSchema = new mongoose.Schema({
  reviews: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
      }
   ]
  })
   module.exports = mongoose.model("show", showSchema);