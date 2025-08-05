const { body, validationResult } = require("express-validator");

// Validation for user registration
exports.validateRegister = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validation for course creation
exports.validateCourse = [
    body("title").notEmpty().withMessage("Title is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validation for enrolling a student
exports.validateEnrollment = [
    body("student").notEmpty().withMessage("Student ID is required"),
    body("course").notEmpty().withMessage("Course ID is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
