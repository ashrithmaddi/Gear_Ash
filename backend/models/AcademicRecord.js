const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  remarks: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);
