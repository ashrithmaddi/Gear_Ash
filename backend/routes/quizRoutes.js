const express = require("express");
const { getQuizzes, addQuiz, updateQuiz, deleteQuiz, submitQuiz } = require("../controllers/quizController");
const { verifyToken, isInstructor } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:lessonId", verifyToken, getQuizzes); // Get quizzes for a course
router.post("/",  addQuiz); // Add a new quiz
router.put("/:quizId", verifyToken, isInstructor, updateQuiz); // Update a quiz
router.delete("/:quizId", verifyToken, isInstructor, deleteQuiz); // Delete a quiz
router.post("/:quizId/submit", verifyToken, submitQuiz); // Submit quiz answers

module.exports = router;
