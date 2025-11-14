const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    system: {
        siteName: { type: String, required: true },
        maintenanceMode: { type: Boolean, default: false }
    },
    website: {
        theme: { type: String, default: "light" }
    },
    instructor: {
        revenueShare: { type: Number, default: 70 }
    },
    smtp: {
        host: { type: String, required: true },
        port: { type: Number, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Settings", SettingsSchema);