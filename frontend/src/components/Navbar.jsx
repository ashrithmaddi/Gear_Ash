import React, { useContext, useState, useRef, useEffect } from "react";
import { userAdminContextObj } from "../context/UserAdmin";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { currentUser, setCurrentUser } = useContext(userAdminContextObj);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setDropdownOpen(false);
    navigate("/")
    
  };

  return (
    <nav className="top-navbar">
      <div className="nav-container">
        <div className="nav-brand">{currentUser.role} Dashboard</div>
        <div className="nav-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>
        <div className="nav-links">
          <div className="nav-profile" ref={dropdownRef} style={{ position: "relative" }}>
            <img
              src="frontend/src/assests/Profile-DWMY1YUr.png"
              alt="Profile"
              className="profile-img"
            />
            <span className="profile-name">{currentUser.firstName} {currentUser.lastName}</span>
            <i
              className="fas fa-chevron-down"
              style={{ cursor: "pointer" }}
              onClick={() => setDropdownOpen((open) => !open)}
            ></i>
            {dropdownOpen && (
              <div
                className="dropdown-menu show"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  minWidth: "120px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 1000,
                  padding: "0.5rem 0"
                }}
              >
                <button
                  className="dropdown-item w-100 text-start"
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.5rem 1rem",
                    color: "#333",
                    cursor: "pointer"
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;