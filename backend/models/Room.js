const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  category: String,
  availableSlots: [String],  // Example: ['10AM-11AM', '11AM-12PM']
  closedSlots: [String],     // Slots that are no longer available
  bookings: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      slot: String,
      date: String,
      courseCode: String,
      courseName: String
    }
  ]
});

module.exports = mongoose.model('Room', roomSchema);
