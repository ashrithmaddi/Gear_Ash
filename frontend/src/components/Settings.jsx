import React, { useState, useRef, useEffect } from "react";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("system"); // State to track the active tab
  const settingsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setActiveTab(""); // Close tab content if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tab content for System Settings
  const renderSystemSettings = () => (
    <div className="settings-content">
      <h5>⚙️ System Settings</h5>
      <p>Configure system preferences, security, and notifications below.</p>
      <div className="form-group">
        <label htmlFor="siteName">Site Name 🖊️</label>
        <input type="text" id="siteName" className="form-control" placeholder="Enter site name" />
      </div>
      <div className="form-group">
        <label htmlFor="timezone">Timezone 🕒</label>
        <select id="timezone" className="form-control">
          <option value="UTC">UTC</option>
          <option value="PST">PST</option>
          <option value="EST">EST</option>
        </select>
      </div>
      <button className="btn btn-primary">💾 Save Changes</button>
    </div>
  );

  // Tab content for Website Settings
  const renderWebsiteSettings = () => (
    <div className="settings-content">
      <h5>🌐 Website Settings</h5>
      <p>Customize the appearance and functionality of your website.</p>
      <div className="form-group">
        <label htmlFor="theme">Select Theme 🎨</label>
        <select id="theme" className="form-control">
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="logo">Upload Logo 🖼️</label>
        <input type="file" id="logo" className="form-control" />
      </div>
      <div className="form-group">
        <label htmlFor="maintenance">Enable Maintenance Mode 🛠️</label>
        <input type="checkbox" id="maintenance" className="form-check-input" />
      </div>
      <button className="btn btn-primary">💾 Save Changes</button>
    </div>
  );

  // Tab content for Instructor Settings
  const renderInstructorSettings = () => (
    <div className="settings-content">
      <h5>👨‍🏫 Instructor Settings</h5>
      <p>Set preferences for instructors.</p>
      <div className="form-group">
        <label htmlFor="availability">Instructor Availability 📅</label>
        <select id="availability" className="form-control">
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="emailNotifications">Enable Email Notifications 📧</label>
        <input type="checkbox" id="emailNotifications" className="form-check-input" />
      </div>
      <div className="form-group">
        <label htmlFor="profilePicture">Upload Profile Picture 🖼️</label>
        <input type="file" id="profilePicture" className="form-control" />
      </div>
      <button className="btn btn-primary">💾 Save Changes</button>
    </div>
  );

  // Tab content for SMTP Settings
  const renderSMTPSettings = () => (
    <div className="settings-content">
      <h5>📧 SMTP Settings</h5>
      <p>Configure your email SMTP settings for notifications.</p>
      <div className="form-group">
        <label htmlFor="smtpHost">SMTP Host 🖥️</label>
        <input type="text" id="smtpHost" className="form-control" placeholder="Enter SMTP server" />
      </div>
      <div className="form-group">
        <label htmlFor="smtpPort">SMTP Port 🔌</label>
        <input type="text" id="smtpPort" className="form-control" placeholder="Enter SMTP port" />
      </div>
      <div className="form-group">
        <label htmlFor="smtpUsername">SMTP Username 👤</label>
        <input type="text" id="smtpUsername" className="form-control" placeholder="Enter SMTP username" />
      </div>
      <div className="form-group">
        <label htmlFor="smtpPassword">SMTP Password 🔑</label>
        <input type="password" id="smtpPassword" className="form-control" placeholder="Enter SMTP password" />
      </div>
      <div className="form-group">
        <label htmlFor="encryptionType">Encryption Type 🔒</label>
        <select id="encryptionType" className="form-control">
          <option value="none">None</option>
          <option value="ssl">SSL</option>
          <option value="tls">TLS</option>
        </select>
      </div>
      <div className="d-flex gap-3">
        <button className="btn btn-secondary">📧 Send Test Email</button>
        <button className="btn btn-primary">💾 Save Settings</button>
      </div>
    </div>
  );

  return (
    <div className="settings-container" ref={settingsRef}>
      <h2>Settings</h2>
      {/* Tabs */}
      <div className="tabs d-flex gap-3 mb-4">
        <button
          className={`btn ${activeTab === "system" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("system")}
        >
          ⚙️ System
        </button>
        <button
          className={`btn ${activeTab === "website" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("website")}
        >
          🌐 Website
        </button>
        <button
          className={`btn ${activeTab === "instructor" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("instructor")}
        >
          👨‍🏫 Instructor
        </button>
        <button
          className={`btn ${activeTab === "smtp" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("smtp")}
        >
          📧 SMTP Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "system" && renderSystemSettings()}
      {activeTab === "website" && renderWebsiteSettings()}
      {activeTab === "instructor" && renderInstructorSettings()}
      {activeTab === "smtp" && renderSMTPSettings()}
    </div>
  );
}

export default Settings;