const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: String,
  courseName: String
});

module.exports = mongoose.model('Course', courseSchema);
