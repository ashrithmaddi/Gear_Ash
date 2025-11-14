import React, { useState } from "react";
import "./Messages.css";

function Messages() {
  const [activeTab, setActiveTab] = useState("inbox"); // Tracks the active tab
  const [emails, setEmails] = useState([
    {
      id: 1,
      sender: "John Doe",
      subject: "Meeting Tomorrow",
      preview: "Hi, I would like to schedule a meeting tomorrow...",
      time: "10:30 AM",
      starred: true,
      folder: "inbox",
    },
    {
      id: 2,
      sender: "Jane Smith",
      subject: "Project Update",
      preview: "Here's the latest update on the project...",
      time: "Yesterday",
      starred: false,
      folder: "inbox",
    },
  ]);

  const [composeEmail, setComposeEmail] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  const toggleStar = (id) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComposeEmail((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = () => {
    console.log("Email sent:", composeEmail);
    setEmails((prevEmails) => [
      ...prevEmails,
      {
        id: prevEmails.length + 1,
        sender: "You",
        subject: composeEmail.subject,
        preview: composeEmail.message,
        time: "Now",
        starred: false,
        folder: "sent",
      },
    ]);
    setComposeEmail({ recipient: "", subject: "", message: "" });
    setActiveTab("sent");
  };

  const renderEmails = (folder) => {
    const filteredEmails = emails.filter((email) => email.folder === folder);
    return filteredEmails.map((email) => (
      <div key={email.id} className="email-item d-flex align-items-center">
        <div className="form-check me-2">
          <input
            type="checkbox"
            className="form-check-input"
            id={`email${email.id}`}
          />
          <label className="form-check-label" htmlFor={`email${email.id}`}></label>
        </div>
        <i
          className={`me-2 ${
            email.starred ? "fas fa-star star" : "far fa-star star-outline"
          }`}
          onClick={() => toggleStar(email.id)}
        ></i>
        <div className="d-flex justify-content-between w-100">
          <div className="fw-bold" style={{ width: "150px" }}>
            {email.sender}
          </div>
          <div className="d-flex flex-grow-1">
            <div className="fw-bold me-2">{email.subject}</div>
            <div className="email-preview text-muted flex-grow-1">
              {email.preview}
            </div>
          </div>
          <div className="text-muted ms-2">{email.time}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="messages-container ms-4">
      <h1 className="mb-2">Messages</h1>

      {/* Tabs */}
      <div className="tabs d-flex gap-3 mb-4">
        <button
          className={`btn ${activeTab === "inbox" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox <span className="badge-count">3</span>
        </button>
        <button
          className={`btn ${activeTab === "compose" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("compose")}
        >
          Compose
        </button>
        <button
          className={`btn ${activeTab === "sent" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent <span className="badge-count">2</span>
        </button>
        <button
          className={`btn ${activeTab === "drafts" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("drafts")}
        >
          Drafts <span className="badge-count dark">1</span>
        </button>
        <button
          className={`btn ${activeTab === "trash" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("trash")}
        >
          Trash
        </button>
      </div>

      {/* Content */}
      {activeTab === "inbox" && <div className="email-list">{renderEmails("inbox")}</div>}
      {activeTab === "sent" && <div className="email-list">{renderEmails("sent")}</div>}
      {activeTab === "drafts" && <div className="email-list">{renderEmails("drafts")}</div>}
      {activeTab === "trash" && <div className="email-list">{renderEmails("trash")}</div>}

      {activeTab === "compose" && (
        <div className="compose-email">
          <div className="mb-3">
            <label htmlFor="recipient" className="form-label">
              To
            </label>
            <input
              type="email"
              className="form-control"
              id="recipient"
              name="recipient"
              value={composeEmail.recipient}
              onChange={handleInputChange}
              placeholder="Enter recipient email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              name="subject"
              value={composeEmail.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              className="form-control message-area"
              id="message"
              name="message"
              value={composeEmail.message}
              onChange={handleInputChange}
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-send" onClick={handleSend}>
              Send
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setComposeEmail({ recipient: "", subject: "", message: "" })
              }
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;