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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>
      
      <nav className="navbar navbar-expand-lg custom-navbar z-70">
        <div className="container-fluid px-4 py-2">
          {/* Enhanced Brand Logo */}
          <Link className="navbar-brand brand-enhanced" to="/studash">
            <div className="brand-container">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" className="graduation-icon">
                  <path d="M12,3L1,9L12,15L21,12.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-main">Gearup4</span>
                <span className="brand-sub">Student Portal</span>
              </div>
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNavbar"
            aria-controls="studentNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
          </button>

          <div className="collapse navbar-collapse" id="studentNavbar">
            {/* Enhanced Navigation Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-enhanced">
              <li className="nav-item">
                <Link className="nav-link nav-enhanced-link" to="/courses">
                  <div className="nav-link-container">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="nav-text">Courses</span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-enhanced-link" to="/my-learning">
                  <div className="nav-link-container">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="nav-text">My Learning</span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-enhanced-link" to="/profile">
                  <div className="nav-link-container">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="nav-text">Profile</span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-enhanced-link" to="/certificates">
                  <div className="nav-link-container">
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="nav-text">Certificates</span>
                  </div>
                </Link>
              </li>
            </ul>

            {/* Enhanced User Actions */}
            <div className="navbar-actions">
              <div className="user-info">
                <div className="user-avatar">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              
              <button className="btn-logout-enhanced" onClick={handleLogout}>
                <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Custom CSS */}
        <style jsx="true">{`
          .custom-navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0.8rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .custom-navbar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.3" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
          }

          /* Enhanced Brand */
          .brand-enhanced {
            text-decoration: none;
            color: white !important;
            transition: all 0.3s ease;
          }

          .brand-enhanced:hover {
            transform: translateY(-2px);
            color: #fff !important;
          }

          .brand-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .brand-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .graduation-icon {
            width: 24px;
            height: 24px;
            color: white;
          }

          .brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }

          .brand-main {
            font-family: 'Poppins', sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
          }

          .brand-sub {
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          /* Enhanced Mobile Toggle */
          .custom-toggler {
            border: none;
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }

          .custom-toggler:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
          }

          .custom-toggler:focus {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
          }

          .toggler-line {
            display: block;
            width: 22px;
            height: 2px;
            background: white;
            margin: 4px 0;
            border-radius: 2px;
            transition: all 0.3s ease;
          }

          .custom-toggler[aria-expanded="true"] .toggler-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .custom-toggler[aria-expanded="true"] .toggler-line:nth-child(2) {
            opacity: 0;
          }

          .custom-toggler[aria-expanded="true"] .toggler-line:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }

          /* Enhanced Navigation */
          .nav-enhanced {
            gap: 1rem;
          }

          .nav-enhanced-link {
            color: rgba(255, 255, 255, 0.9) !important;
            padding: 0.75rem 1.2rem !important;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 1rem;
          }

          .nav-enhanced-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: 12px;
          }

          .nav-enhanced-link:hover::before {
            opacity: 1;
          }

          .nav-enhanced-link:hover {
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .nav-link-container {
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            z-index: 1;
          }

          .nav-icon {
            width: 18px;
            height: 18px;
            transition: transform 0.3s ease;
          }

          .nav-enhanced-link:hover .nav-icon {
            transform: scale(1.1);
          }

          .nav-text {
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.3px;
          }

          /* Enhanced User Section */
          .navbar-actions {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .user-info {
            display: flex;
            align-items: center;
          }

          .user-avatar {
            width: 38px;
            height: 38px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }

          .user-avatar:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.4);
          }

          .user-avatar svg {
            width: 20px;
            height: 20px;
            color: white;
          }

          /* Enhanced Logout Button */
          .btn-logout-enhanced {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 0.7rem 1.2rem;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
          }

          .btn-logout-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }

          .btn-logout-enhanced:hover::before {
            left: 100%;
          }

          .btn-logout-enhanced:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            color: white;
          }

          .logout-icon {
            width: 18px;
            height: 18px;
            transition: transform 0.3s ease;
          }

          .btn-logout-enhanced:hover .logout-icon {
            transform: translateX(2px);
          }

          .logout-text {
            position: relative;
            z-index: 1;
          }

          /* Active Link Styles */
          .nav-enhanced-link.active {
            background: rgba(255, 255, 255, 0.15);
            color: white !important;
          }

          .nav-enhanced-link.active::before {
            opacity: 1;
          }

          /* Responsive Design */
          @media (max-width: 991px) {
            .brand-main {
              font-size: 1.2rem;
            }

            .brand-text {
              display: none;
            }

            .brand-icon {
              width: 35px;
              height: 35px;
            }

            .graduation-icon {
              width: 20px;
              height: 20px;
            }

            .nav-enhanced {
              margin-top: 1rem;
              padding-top: 1rem;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .nav-enhanced-link {
              margin: 0.25rem 0;
              border-radius: 8px;
            }

            .navbar-actions {
              margin-top: 1rem;
              padding-top: 1rem;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              justify-content: space-between;
            }

            .btn-logout-enhanced {
              flex: 1;
              justify-content: center;
              max-width: 200px;
            }
          }

          @media (max-width: 576px) {
            .custom-navbar {
              padding: 0.6rem 0;
            }

            .brand-main {
              font-size: 1.1rem;
            }

            .nav-text {
              font-size: 0.95rem;
            }

            .btn-logout-enhanced {
              padding: 0.6rem 1rem;
              font-size: 0.9rem;
            }

            .logout-icon {
              width: 16px;
              height: 16px;
            }

            .nav-icon {
              width: 16px;
              height: 16px;
            }
          }

          /* Smooth scrolling effect */
          @media (prefers-reduced-motion: no-preference) {
            .custom-navbar {
              transition: all 0.3s ease;
            }
          }

          /* Focus styles for accessibility */
          .nav-enhanced-link:focus,
          .btn-logout-enhanced:focus {
            outline: 2px solid rgba(255, 255, 255, 0.8);
            outline-offset: 2px;
          }

          /* Animation for navbar reveal */
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .custom-navbar {
            animation: slideDown 0.5s ease-out;
          }
        `}</style>
      </nav>
    </>
  );
};

export default StudentNavbar;