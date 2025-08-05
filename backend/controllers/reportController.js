const Report = require("../models/Report");

exports.getAdminRevenue = async (req, res) => {
    try {
        const report = await Report.findOne();
        res.json({ adminRevenue: report.adminRevenue });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admin revenue" });
    }
};

exports.getEnrollmentStats = async (req, res) => {
    try {
        const report = await Report.findOne();
        res.json({ enrollmentStats: report.enrollmentStats });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch enrollment statistics" });
    }
};

exports.getActiveUsers = async (req, res) => {
    try {
        const report = await Report.findOne();
        res.json({ activeUsers: report.activeUsers });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch active users" });
    }
};