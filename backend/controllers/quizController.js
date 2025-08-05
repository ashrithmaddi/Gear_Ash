const { LessonModel } = require("../models/LessonSection");
const Quiz = require("../models/Quiz");

// Get all quizzes for a course
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ lessonId: req.params.lessonId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

// Add a new quiz
const addQuiz = async (req, res) => {
  try {
    const { lessonId, title, questions } = req.body;
    const newQuiz = new Quiz({ lessonId, title, questions});
    await newQuiz.save();
    await LessonModel.findByIdAndUpdate(lessonId, { quiz: newQuiz._id })

    res.status(201).json({ message: "Quiz added successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error adding quiz", error });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    res.status(200).json({ message: "Quiz updated", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

// Submit a quiz
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    res.status(200).json({ message: "Quiz submitted", score });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error });
  }
};

module.exports={addQuiz,getQuizzes,updateQuiz,deleteQuiz,submitQuiz}