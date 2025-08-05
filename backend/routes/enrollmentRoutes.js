const express = require("express");
const { getEnrollments, enrollStudent } = require("../controllers/enrollmentController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, isAdmin, getEnrollments); // Admin can view enrollments
router.post("/", verifyToken, enrollStudent); // Any user can enroll in a course
router.get("/is-enrolled", async (req, res) => {
  const { student, course } = req.query;
  if (!student || !course) return res.json({ isEnrolled: false });
  const enrollment = await Enrollment.findOne({ student, course });
  res.json({ isEnrolled: !!enrollment });
});
module.exports = router;
