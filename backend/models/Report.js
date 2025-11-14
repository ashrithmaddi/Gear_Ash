const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    adminRevenue: {
        type: Number,
        required: true,
        default: 0
    },
    enrollmentStats: {
        type: Map,
        of: Number,
        default: {}
    },
    activeUsers: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Report", ReportSchema);