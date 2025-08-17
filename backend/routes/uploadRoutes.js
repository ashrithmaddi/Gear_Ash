const express = require('express');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');

const router = express.Router();

// Upload profile picture
router.post('/profile/:userId', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.params.userId;
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    // Update user with new profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture uploaded successfully',
      user,
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

// Upload course image
router.post('/course/:courseId', verifyToken, upload.single('courseImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const courseId = req.params.courseId;
    const imageUrl = `/uploads/courses/${req.file.filename}`;

    // Update course with new image
    const course = await Course.findByIdAndUpdate(
      courseId,
      { image: imageUrl },
      { new: true }
    );

    res.json({
      message: 'Course image uploaded successfully',
      course,
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading course image:', error);
    res.status(500).json({ message: 'Failed to upload course image' });
  }
});

// Delete uploaded file
router.delete('/delete', verifyToken, async (req, res) => {
  try {
    const { filePath } = req.body;
    const fs = require('fs');
    const path = require('path');
    
    const fullPath = path.join(__dirname, '../', filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

module.exports = router;
