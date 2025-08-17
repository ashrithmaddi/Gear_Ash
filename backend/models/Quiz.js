const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  instructions: { type: String, default: "" },
  questions: [{ 
      question: { type: String, required: true }, 
      options: [{ type: String, required: true }], 
      answer: { type: String, required: true }, // "1", "2", "3", or "4"
      marks: { type: Number, required: true, default: 1 }
  }],
  totalMarks: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 60 }, // in minutes
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Calculate total marks before saving
QuizSchema.pre('save', function() {
  this.totalMarks = this.questions.reduce((total, question) => total + (question.marks || 0), 0);
});

module.exports = mongoose.model("Quiz", QuizSchema);
