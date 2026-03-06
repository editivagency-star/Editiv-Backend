const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  datetime: Date,
  message: String,
  status: {
    type: String,
    default: "new"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
