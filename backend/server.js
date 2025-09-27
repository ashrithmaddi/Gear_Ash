const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); // Import student routes
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // Import upload routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://gear-ash.vercel.app',
        'https://www.gearup4.com',
        'https://gearup4.com'  // Add both www and non-www versions
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};
app.use(cors(corsOptions));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes for authentication-related routes
app.use('/api/student', studentRoutes); // Student routes
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // Upload routes for file handling
app.use('/api/courses', require('./routes/courseRoutes'));
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
    console.log("error Occured: ", err);
    res.send({ message: err.message });
});
