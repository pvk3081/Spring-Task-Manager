var mongoose = require("mongoose");

var bookingSchema = new mongoose.Schema({
   name: String,
   city: String,
   room: Number,
   checkin: String,
   checkout: String,
});

module.exports = mongoose.model("Booking", bookingSchema);

