const express = require("express");
const { 
  getQuizzes, 
  addQuiz, 
  updateQuiz, 
  deleteQuiz, 
  submitQuiz, 
  getQuizById, 
  toggleQuizEnabled,
  getQuizCounts
} = require("../controllers/quizController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all quizzes for a course or section
router.get("/course/:courseId", getQuizzes);
router.get("/section/:sectionId", getQuizzes);
router.get("/:quizId", getQuizById);

// Get quiz counts for multiple sections
router.post("/counts", getQuizCounts);

// Add a new quiz
router.post("/add", addQuiz);

// Update a quiz
router.put("/update/:quizId", updateQuiz);

// Delete a quiz
router.delete("/:quizId", verifyToken, isAdmin, deleteQuiz);

// Toggle quiz enabled status
router.patch("/toggle-enabled/:quizId", verifyToken, isAdmin, toggleQuizEnabled);

// Submit quiz answers (for students)
router.post("/:quizId/submit", verifyToken, submitQuiz);

module.exports = router;
