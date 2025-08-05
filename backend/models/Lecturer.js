const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    joiningDate: {
        type: Date,
        required: true
    },
    password:{type:String,required:true},

    number: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        default: "Active"
    }
});

module.exports = mongoose.model('Lecturer', LecturerSchema);
