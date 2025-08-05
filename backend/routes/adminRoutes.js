const express = require("express");
const { 
  getTotalStudents, getTotalLecturers, getTotalCourses, getActiveLecturers, 
  getLecturerList, updateLecStatus, getActiveStudents, getNewStudentsThisMonth, 
  getPendingFees, getStudentList, getAttendanceData, getTestResults,
  getCourseList, getCourseStatistics,
  getActiveCourses
} = require("../controllers/adminController")

const router = express.Router();

router.get("/getTotalStudents", getTotalStudents);
router.get("/getActiveStudents", getActiveStudents);
router.get("/getNewStudentsThisMonth", getNewStudentsThisMonth);
router.get("/getPendingFees", getPendingFees);
router.get("/getStudentList", getStudentList);

router.get("/getTotalLecturers", getTotalLecturers);
router.get("/getTotalCourses", getTotalCourses);
router.get("/getActiveLecturers", getActiveLecturers)
router.get("/getLecturerList", getLecturerList)
router.put("/updateLecturerStatus/:lecturerId", updateLecStatus)
router.get("/getAttendanceData", getAttendanceData);
router.get("/getTestResults", getTestResults);
router.get("/getCourseList", getCourseList);
router.get("/getCourseStatistics", getCourseStatistics);
router.get("/getActiveCourses", getActiveCourses);


module.exports = router;
