const mongoose = require('mongoose'); // Import mongoose

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: String, required: true },
  paymentAmount: { type: Number, default: 0 },
  enrollmentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
