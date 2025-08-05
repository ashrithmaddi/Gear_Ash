const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const updatedSettings = await Settings.findOneAndUpdate({}, req.body, { new: true });
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ error: "Failed to update settings" });
    }
};