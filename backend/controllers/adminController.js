const User = require("../models/User");
const Course = require("../models/Course");
const Lecturer = require("../models/Lecturer");
const Attendance = require("../models/Attendance");
const TestResult = require("../models/TestResult");

const getTotalStudents = async (req, res) => {
  try {
    const userList = await User.find({ role: "student" });
    const students = userList.length;
    res.json({ students });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getTotalLecturers = async (req, res) => {
  try {
    const userList = await Lecturer.find();
    const lecturers = userList.length;
    res.json({ lecturers });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getTotalCourses = async (req, res) => {
  try {
    const courseList = await Course.find();
    const courses = courseList.length;
    res.json({ courses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getActiveLecturers = async (req, res) => {
  try {
    const LecList = await Lecturer.find({ status: "Active" });
    const active = LecList.length;
    res.json({ active });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getLecturerList = async (req, res) => {
  try {
    const lecList = await Lecturer.find();
    res.json({ lecList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateLecStatus = async (req, res) => {
  try {
    const id = req.params.lecturerId;
    const status = req.body.status;
    await Lecturer.findByIdAndUpdate(id, { status: status });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getActiveStudents = async (req, res) => {
  try {
    const activeStudents = await User.find({
      role: "student",
      status: "Active",
    });
    res.json({ active: activeStudents.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getNewStudentsThisMonth = async (req, res) => {
  try {
    // Defensive: Only count students with a valid createdAt field
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const newStudents = await User.find({
      role: "student",
      createdAt: { $gte: startOfMonth, $lte: now },
    });
    res.json({ newThisMonth: newStudents.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getPendingFees = async (req, res) => {
  try {
    const pending = await User.find({
      role: "student",
      pendingFees: { $gt: 0 },
    });
    res.json({ pendingFees: pending.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getStudentList = async (req, res) => {
  try {
    const studentList = await User.find({ role: "student" });
    res.json({ studentList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getAttendanceData = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json({ attendance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getTestResults = async (req, res) => {
  try {
    const results = await TestResult.find();
    res.json({ testResults: results });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getCourseList = async (req, res) => {
  try {
    const courseList = await Course.find();
    res.json({ courseList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getCourseStatistics = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: "Active" });
    res.json({ totalCourses, activeCourses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getActiveCourses = async (req, res) => {
  try {
    const activeCourses = await Course.countDocuments({ enabled: true });
    res.json({ activeCourses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getTotalStudents,
  getActiveStudents,
  getNewStudentsThisMonth,
  getPendingFees,
  getStudentList,
  getTotalLecturers,
  getTotalCourses,
  getActiveLecturers,
  getLecturerList,
  updateLecStatus,
  getAttendanceData,
  getTestResults,
  getCourseList,
  getCourseStatistics,
  getActiveCourses,
};