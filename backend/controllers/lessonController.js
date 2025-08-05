const Course = require("../models/Course");
const {SectionModel,LessonModel} = require("../models/LessonSection");


const addSection = async (req, res) => {
  try {
      const newSection = new SectionModel(req.body);
      secres=await newSection.save();
      await Course.findByIdAndUpdate(newSection.course,{$push:{sections:secres._id}})

      res.status(201).send({ message: "Section created successfully" });
  } catch (error) {
      res.status(500).send({ error: error.message});
  }
};

const getSections = async (req, res) => {
  try {
      const sections = await SectionModel.find({courseId: req.params.sectionId}).populate("course");
      res.json(sections);
  } catch (error) {
      res.status(500).send({ error: error.message});
  }
};


// Get all lessons for a course
const getLessons = async (req, res) => {
  try {
    const lessons = await LessonModel.find({ courseId: req.params.courseId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lessons", error });
  }
};

// Add a new lesson
const addLesson = async (req, res) => {
  try {
    const { section, title, content,lessontype,quiz} = req.body;
    const newLesson = new LessonModel({ section, title, content,lessontype,quiz });
    let lessonres=await newLesson.save();
    let updlesson=await SectionModel.findByIdAndUpdate(section,{$push:{lessons:lessonres._id}})

    res.status(201).json({ message: "Lesson added successfully", lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: "Error adding lesson", error });
  }
};

// Update a lesson
const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, { new: true });
    res.status(200).json({ message: "Lesson updated", lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ message: "Error updating lesson", error });
  }
};

// Delete a lesson
const deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lesson", error });
  }
};



module.exports = { addSection, getSections,getLessons,deleteLesson,updateLesson,addLesson };