const express = require("express");
const { getEnrollments, enrollStudent, checkEnrollmentStatus } = require("../controllers/enrollmentController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, isAdmin, getEnrollments); // Admin can view enrollments
router.post("/", verifyToken, enrollStudent); // Any user can enroll in a course
router.get("/is-enrolled", checkEnrollmentStatus); // Check enrollment status

module.exports = router;
