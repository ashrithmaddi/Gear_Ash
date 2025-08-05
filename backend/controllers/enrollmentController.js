const Enrollment = require("../models/Enrollment");

exports.getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate("student").populate("course");
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const { student, course } = req.body;

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ student, course });
        if (existingEnrollment) {
            return res.status(400).json({ error: "Student already enrolled" });
        }

        const newEnrollment = new Enrollment(req.body);
        await newEnrollment.save();
        res.status(201).json({ message: "Student enrolled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Enrollment failed" });
    }
};
