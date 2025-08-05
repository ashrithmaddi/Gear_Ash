const express = require("express");
const { getLessons, addLesson, updateLesson, deleteLesson, addSection, getSections } = require("../controllers/lessonController");
const { verifyToken, isInstructor } = require("../middlewares/authMiddleware");

const router = express.Router();
//sections
router.post("/section",addSection);
router.get("/getsection/:sectionId",getSections);


//lessons
router.get("/lesson/:courseId", verifyToken, getLessons); // Get all lessons for a course
router.post("/lesson", addLesson); // Add a new lesson
router.put("/lesson/:lessonId", verifyToken, isInstructor, updateLesson); // Update a lesson
router.delete("lesson/:lessonId", verifyToken, isInstructor, deleteLesson); // Delete a lesson

module.exports = router;
