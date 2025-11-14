const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }, // "1", "2", "3", "4"
    marks: { type: Number, default: 1 }
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructions: { type: String },
    questions: [QuizQuestionSchema],
    createdAt: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true } // Add enabled flag
});

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["Video", "Text", "PDF", "Document", "Image", "Excel"], required: true },
    description: { type: String },
    textContent: { type: String },
    videoUrl: { type: String },
    imageUrl: { type: String },
    fileUrl: { type: String },
    enabled: { type: Boolean, default: true }
});

const SectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    lessons: [LessonSchema],
    quizzes: [QuizSchema],
    enabled: { type: Boolean, default: true }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  sections: [SectionSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Free", "Paid"], default: "Free" },
  amount: {
    type: Number,
    required: function () {
      return this.status === "Paid";
    },
    min: 0
  },
  image: { type: String },
  totolStudentsEnrolled: { type: Number },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model("Course", CourseSchema);
