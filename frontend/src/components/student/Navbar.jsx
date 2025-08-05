import React from "react";
import { Link, useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid p-2">
        <Link className="navbar-brand" to="/studash">Student Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#studentNavbar" aria-controls="studentNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="studentNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-learning">My Learning</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;