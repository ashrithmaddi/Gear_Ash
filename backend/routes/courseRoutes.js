const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require("../models/Course");
const { 
  addCourse, 
  getCourses, 
  getStatistics, 
  updateCourse,
  deleteCourse, 
  addLessonToSection,
  getSections,
  deleteSection,
  deleteLesson,
  toggleCourseEnabled,
  toggleSectionEnabled,
  toggleLessonEnabled,
  addQuizToSection,
  toggleQuizEnabled,
  getCourseById
} = require('../controllers/courseController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/add', upload.single('image'), addCourse);
router.get('/all', getCourses);
router.get('/statistics', getStatistics);
router.get('/every', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});
router.get('/:id', getCourseById);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);

// Enable/Disable course
router.patch('/toggle-enabled/:id', toggleCourseEnabled);

// Enable/Disable section
router.patch('/toggle-section-enabled/:courseId/:sectionId', toggleSectionEnabled);

// Enable/Disable lesson
router.patch('/toggle-lesson-enabled/:courseId/:sectionId/:lessonId', toggleLessonEnabled);

// Enable/Disable quiz in section
router.patch('/toggle-quiz-enabled/:courseId/:sectionId/:quizId', toggleQuizEnabled);

// Delete section from course
router.delete('/delete-section/:courseId/:sectionId', deleteSection);

// Delete lesson from section in course
router.delete('/delete-lesson/:courseId/:sectionId/:lessonId', deleteLesson);

router.put(
  '/add-lesson/:courseId/:sectionId',
  upload.single('file'),
  addLessonToSection
);
router.get('/sections/:id', getSections);

// Add Quiz to Section
router.post(
  '/add-quiz/:courseId/:sectionId',
  addQuizToSection
);

// Update a lesson in a section
router.put('/update-lesson/:courseId/:sectionId/:lessonId', async (req, res) => {
  const { courseId, sectionId, lessonId } = req.params;
  const update = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });
    const lesson = section.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    Object.assign(lesson, update);
    course.markModified("sections");
    await course.save();
    res.status(200).json({ message: "Lesson updated", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quiz in a section
router.put('/update-quiz/:courseId/:sectionId/:quizId', async (req, res) => {
  const { courseId, sectionId, quizId } = req.params;
  const update = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });
    const quiz = section.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    Object.assign(quiz, update);
    course.markModified("sections");
    await course.save();
    res.status(200).json({ message: "Quiz updated", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const courses = await Course.find({
      enabled: true,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { level: searchRegex },
        { category: searchRegex }
        // You can add more fields here if needed
      ],
    });

    res.json({
      success: true,
      courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search courses",
      error: error.message,
    });
  }
});

module.exports = router;