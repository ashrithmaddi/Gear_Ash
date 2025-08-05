const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);
