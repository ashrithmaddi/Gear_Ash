const mongoose=require('mongoose')
const SectionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true },
    title: { type: String, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    createdAt: { type: Date, default: Date.now }
  });
  
  const LessonSchema = new mongoose.Schema({
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    lessontype: { type: String },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    createdAt: { type: Date, default: Date.now }
  });
  
SectionModel=mongoose.model("Section",SectionSchema)
LessonModel=mongoose.model("Lesson",LessonSchema)
module.exports={SectionModel,LessonModel}