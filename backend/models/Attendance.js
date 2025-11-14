const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
