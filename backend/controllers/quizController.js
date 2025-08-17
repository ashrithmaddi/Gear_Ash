const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

// Get all quizzes for a course/section
const getQuizzes = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const query = {};
    
    if (courseId) query.course = courseId;
    if (sectionId) query.section = sectionId;
    
    const quizzes = await Quiz.find(query)
      .populate('course', 'title');
      
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};

// Add a new quiz
const addQuiz = async (req, res) => {
  try {
    const { title, course, section, instructions, questions, timeLimit } = req.body;
    
    // Validate required fields
    if (!title || !course || !section || !questions || questions.length === 0) {
      return res.status(400).json({ 
        message: "Title, course, section, and at least one question are required" 
      });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || q.options.length < 2 || !q.answer || !q.marks) {
        return res.status(400).json({ 
          message: `Question ${i + 1} is incomplete. Each question must have text, at least 2 options, correct answer, and marks.` 
        });
      }
      
      // Validate that all options are filled
      if (q.options.some(option => !option || option.trim() === '')) {
        return res.status(400).json({ 
          message: `Question ${i + 1} has empty options. All provided options must be filled.` 
        });
      }
      
      // Ensure marks is a positive number
      if (isNaN(q.marks) || q.marks <= 0) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have valid marks (positive number).` 
        });
      }
    }

    const newQuiz = new Quiz({ 
      title, 
      course, 
      section,
      instructions: instructions || "",
      questions,
      timeLimit: timeLimit || 60
    });
    
    await newQuiz.save();

    res.status(201).json({ 
      message: "Quiz added successfully", 
      quiz: newQuiz 
    });
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ 
      message: "Error adding quiz", 
      error: error.message 
    });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;
    
    // Recalculate total marks if questions are updated
    if (updateData.questions) {
      updateData.totalMarks = updateData.questions.reduce((total, question) => total + (question.marks || 0), 0);
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};

// Submit a quiz and calculate score
const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // answers should be an array like ["1", "3", "2", "4"]
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    let maxScore = quiz.totalMarks;
    let results = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.answer;
      
      if (isCorrect) {
        score += question.marks;
      }
      
      results.push({
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect,
        marks: isCorrect ? question.marks : 0,
        maxMarks: question.marks
      });
    });

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    res.status(200).json({ 
      message: "Quiz submitted successfully", 
      score,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      results
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Error submitting quiz", error: error.message });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId)
      .populate('course', 'title');
      
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

// Toggle quiz enabled status
const toggleQuizEnabled = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    quiz.enabled = !quiz.enabled;
    await quiz.save();
    
    res.status(200).json({ 
      message: `Quiz ${quiz.enabled ? 'enabled' : 'disabled'} successfully`, 
      quiz 
    });
  } catch (error) {
    console.error("Error toggling quiz status:", error);
    res.status(500).json({ message: "Error toggling quiz status", error: error.message });
  }
};

// Get quiz counts for multiple sections
const getQuizCounts = async (req, res) => {
  try {
    const { sectionIds } = req.body; // Array of section IDs
    
    if (!sectionIds || !Array.isArray(sectionIds)) {
      return res.status(400).json({ message: "Section IDs array is required" });
    }
    
    const counts = {};
    
    await Promise.all(
      sectionIds.map(async (sectionId) => {
        try {
          const count = await Quiz.countDocuments({ section: sectionId });
          counts[sectionId] = count;
        } catch (err) {
          counts[sectionId] = 0;
        }
      })
    );
    
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching quiz counts:", error);
    res.status(500).json({ message: "Error fetching quiz counts", error: error.message });
  }
};

module.exports = {
  addQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizById,
  toggleQuizEnabled,
  getQuizCounts
};