const express = require("express");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/courses/enabled", async (req, res) => {
  try {
    const courses = await Course.find({ enabled: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get student details with enrollments and academic records
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollments = await Enrollment.find({ student: student._id });
    const academicRecords = await AcademicRecord.find({ student: student._id });
    const attendance = await Attendance.find({ student: student._id });

    res.json({
      student,
      enrollments,
      academicRecords,
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create new student
router.post("/", async (req, res) => {
  const {
    fullName,
    dateOfBirth,
    email,
    contactNumber,
    course,
    paymentAmount,
    batch,
  } = req.body;

  // Generate student ID (e.g., STU + random 3 digits)
  const studentId = "STU" + Math.floor(Math.random() * 900 + 100);

  try {
    // Create student
    const student = new Student({
      studentId,
      fullName,
      dateOfBirth,
      email,
      contactNumber,
      batch,
    });

    const newStudent = await student.save();

    // Create enrollment
    if (course) {
      const enrollment = new Enrollment({
        student: newStudent._id,
        course,
        paymentAmount: paymentAmount || 0,
      });

      await enrollment.save();
    }

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    // Also delete related records
    await Enrollment.deleteMany({ student: req.params.id });
    await AcademicRecord.deleteMany({ student: req.params.id });
    await Attendance.deleteMany({ student: req.params.id });

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Update password
router.put("/:id/update-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;



router.get("/:studentId/my-courses", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId }).populate("course");
    const courses = enrollments.map(enr => enr.course);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
