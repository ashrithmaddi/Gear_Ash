import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dash" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/students" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-users"></i> Students
          </NavLink>
        </li>
        <li>
          <NavLink to="/faculty" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-chalkboard-teacher"></i> Faculty
          </NavLink>
        </li>
        <li>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-book"></i> Courses
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-chart-bar"></i> Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-envelope"></i> Messages
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-cog"></i> Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;