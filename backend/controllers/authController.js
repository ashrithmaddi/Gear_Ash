const User = require("../models/User");
const Lecturer = require("../models/Lecturer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user (Admin/Instructor/Student)
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = { ...req.body, password: hashedPassword };
    const userDoc = new User(newUser);
    await userDoc.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Lecturer registration
const lecturerRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, experience, joiningDate, number } = req.body;
    // Check if lecturer already exists
    const exists = await Lecturer.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Lecturer already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const lecturer = new Lecturer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      experience,
      joiningDate,
      number
    });
    await lecturer.save();
    res.status(201).json({ message: "Lecturer registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unified login for User and Lecturer
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user, modelType;

    if (role === "lecturer") {
      user = await Lecturer.findOne({ email });
      modelType = "lecturer";
    } else {
      user = await User.findOne({ email });
      modelType = "user";
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || modelType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return both user and token in a single object
    res.json({
      ...user.toObject(),
      token,
      type: modelType
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  register,
  lecturerRegister,
  login,
  
};
