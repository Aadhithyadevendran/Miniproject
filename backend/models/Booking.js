const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  slot: String,
  date: String,
  courseCode: String,
  courseName: String
});

module.exports = mongoose.model('Booking', bookingSchema);
