const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    status: { type: String, default: 'Active' },
    password:{type:String,required:true},
    role: { type: String, 
        enum: ["student","lecturer","admin"], 
        required: true },
},{
    timestamps: true 
});


module.exports = mongoose.model('User', userSchema);
