import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import HeroImage from "../assests/564.jpg"; // Adjust path as needed

function Landing() {
  const [showLogin, setShowLogin] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gwendolyn:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .landing-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .landing-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .landing-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .landing-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          gap: 60px;
        }

        .left-section {
          flex: 1;
          color: white;
          animation: slideInLeft 1s ease-out;
        }

        .right-section {
          flex: 0 0 450px;
          animation: slideInRight 1s ease-out;
        }

        .brand-header {
          margin-bottom: 30px;
        }

        .brand-title {
          font-family: 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .brand-logo {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          backdrop-filter: blur(10px);
        }

        .brand-subtitle {
          font-size: 0.95rem;
          color: #e8f4f8;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Gwendolyn', cursive;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: #e8f4f8;
          margin-bottom: 25px;
        }

        .hero-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.15rem;
          line-height: 1.7;
          color: #e8f4f8;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin-bottom: 40px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          backdrop-filter: blur(10px);
        }

        .cta-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn-auth {
          padding: 15px 35px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
        }

        .btn-login {
          background: white;
          color: #667eea;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        }

        .btn-register {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-register:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .auth-card {
          background: white;
          border-radius: 25px;
          padding:0;
          
          position: relative;
          overflow: hidden;
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .hero-image-section {
          position: relative;
          margin-top: 50px;
          animation: float 6s ease-in-out infinite;
        }

        .hero-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .float-element {
          position: absolute;
          font-size: 2rem;
          animation: floatAround 8s ease-in-out infinite;
        }

        .float-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .float-2 {
          top: 20%;
          right: 10%;
          animation-delay: 2s;
        }

        .float-3 {
          bottom: 30%;
          left: 5%;
          animation-delay: 4s;
        }

        .float-4 {
          bottom: 10%;
          right: 15%;
          animation-delay: 6s;
        }

        .auth-toggle-text {
          text-align: center;
          padding-bottom:5px;
          margin-bottom:5px;
          font-family: 'Inter', sans-serif;
          color: #64748b;
        }

        .auth-toggle-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          margin-left: 5px;
        }

        .auth-toggle-btn:hover {
          color: #764ba2;
        }

        /* Modal Styles */
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.3s ease-out;
        }

        .auth-modal {
          position: relative;
          max-width: 450px;
          width: 90%;
          animation: slideInUp 0.4s ease-out;
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: rotate(90deg);
        }

        /* Animations */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatAround {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -10px) rotate(90deg);
          }
          50% {
            transform: translate(-5px, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, -5px) rotate(270deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .landing-content {
            flex-direction: column;
            text-align: center;
          }

          .left-section {
            order: 2;
          }

          .right-section {
            order: 1;
            flex: 0 0 auto;
            width: 100%;
            max-width: 450px;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .hero-subtitle {
            font-size: 1.5rem;
          }

          .hero-description {
            margin: 0 auto 30px;
          }

          .features-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .feature-item {
            max-width: 400px;
          }

          .cta-buttons {
            justify-content: center;
          }

          .hero-image-section {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-subtitle {
            font-size: 1.3rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .auth-card {
            padding: 30px 25px;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn-auth {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="landing-container">
        <div className="landing-content">
          {/* Left Section - Hero Content */}
          <div className="left-section">
            <div className="brand-header">
              <div className="brand-title">
                <div className="brand-logo">🎓</div>
                <div>
                  <div>Gearup4</div>
                  <div className="brand-subtitle">Student Portal</div>
                </div>
              </div>
            </div>

            <h1 className="hero-title">
              Welcome to Your Learning Journey
            </h1>
            <div className="hero-subtitle">
              Ready to Learn Something New?
            </div>
            <p className="hero-description">
              Discover amazing courses, enhance your skills, and unlock your potential with our 
              comprehensive learning platform designed just for you.
            </p>

            <ul className="features-list">
              <li className="feature-item">
                <div className="feature-icon">📚</div>
                <span>Access hundreds of expert-led courses</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Learn at your own pace, anytime, anywhere</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon">🏆</div>
                <span>Earn certificates and showcase your skills</span>
              </li>
            </ul>

            <div className="cta-buttons">
              <button 
                className="btn-auth btn-login"
                onClick={() => {
                  setShowLogin(true);
                  setShowAuthModal(true);
                }}
              >
                <span>Login</span>
                <span>→</span>
              </button>
              <button 
                className="btn-auth btn-register"
                onClick={() => {
                  setShowLogin(false);
                  setShowAuthModal(true);
                }}
              >
                <span>Create Account</span>
                <span>✨</span>
              </button>
            </div>

            {typeof HeroImage !== 'undefined' && (
              <div className="hero-image-section">
                <div className="floating-elements">
                  <div className="float-element float-1">💡</div>
                  <div className="float-element float-2">🎯</div>
                  <div className="float-element float-3">⭐</div>
                  <div className="float-element float-4">🚀</div>
                </div>
                <img
                  src={HeroImage}
                  alt="Education Concept"
                  className="hero-image"
                />
              </div>
            )}
          </div>

          {/* Right Section - Auth Card (Desktop Only) */}
          <div className="right-section d-none d-lg-block">
            <div className="auth-card">
              {showLogin ? (
                <>
                  <Login setShowLogin={setShowLogin} />
                 
                </>
              ) : (
                <>
                  <Register onSuccess={() => setShowLogin(true)} />
                  <div className="auth-toggle-text">
                    <span>Already have an account?</span>
                    <button
                      className="auth-toggle-btn"
                      onClick={() => setShowLogin(true)}
                    >
                      Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal (Mobile/Tablet) */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-card">
              <button 
                className="modal-close-btn"
                onClick={() => setShowAuthModal(false)}
              >
                ✕
              </button>
              {showLogin ? (
                <>
                  <Login setShowLogin={setShowLogin} />
                  
                </>
              ) : (
                <>
                  <Register onSuccess={() => setShowLogin(true)} />
                  <div className="auth-toggle-text mt-0 pt-0">
                    <span>Already have an account?</span>
                    <button
                      className="auth-toggle-btn"
                      onClick={() => setShowLogin(true)}
                    >
                      Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;

