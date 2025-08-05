const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  questions: [{ 
      question: String, 
      options: [String], 
      answer: String 
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", QuizSchema);
