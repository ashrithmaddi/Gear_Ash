const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes')
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); // Import student routes
const adminRoutes=require("./routes/adminRoutes") 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();


// Routes
app.use('/api/auth', authRoutes); // Use authRoutes for authentication-related routes
app.use('/api/student', studentRoutes); // Student routes
app.use('/api/admin',adminRoutes)
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

app.use((err,req,res,next)=>{
    console.log("error Occured: ",err)
    res.send({message:err.message})
})
