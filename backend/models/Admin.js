const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  role: { 
    type: String, 
    default: "Admin" },
  revenue: [
    {
      month: { type: String, required: true },
      amount: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Admin", AdminSchema);
