import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userAdminContextObj } from "../../context/UserAdmin";
import HeroImage from "../../assests/564.jpg";

const HeroSection = () => {
  const { currentUser } = useContext(userAdminContextObj);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/student/courses/enabled");
        const data = await response.json();
        setCourses(Array.isArray(data) ? data.slice(0, 5) : data.courses?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course-detail/${courseId}`);
  };

  return (
    <div className="hero-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gwendolyn:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="hero-content">
        <div className="container">
          <div className="row align-items-center min-vh-75 m-0">

            {/* Left side - Content */}
            <div className="col-lg-7 col-md-12 text-white py-5">
              <div className="hero-text-content">
                <div className="welcome-badge mb-4">
                  <span className="badge bg-light text-primary px-4 py-2 rounded-pill">
                    🌟 Welcome Back, Student!
                  </span>
                </div>
                
                <h1 className="hero-title mb-4">
                  Hello{" "}
                  <span className="highlight-name">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <br />
                  <span className="subtitle">Ready to Learn Something New?</span>
                </h1>
                
                <p className="hero-description mb-5">
                  Discover amazing courses, enhance your skills, and unlock your potential with our 
                  comprehensive learning platform designed just for you.
                </p>

                {/* Enhanced Search Form */}
                <form onSubmit={searchHandler} className="hero-search-form mb-4">
                  <div className="search-container">
                    <div className="search-input-wrapper">
                      <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        placeholder="Search for courses, topics, skills..."
                      />
                    </div>
                    <button type="submit" className="search-btn">
                      <span>Search</span>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>

                <div className="hero-actions">
                  <button 
                    className="btn-explore"
                    onClick={() => navigate("/courses")}
                  >
                    <span>🚀 Explore All Courses</span>
                  </button>
                  <button 
                    className="btn-learning"
                    onClick={() => navigate("/my-learning")}
                  >
                    <span>📚 My Learning</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="hero-image-container">
                <div className="floating-elements">
                  <div className="float-element float-1">💡</div>
                  <div className="float-element float-2">🎯</div>
                  <div className="float-element float-3">⭐</div>
                  <div className="float-element float-4">🚀</div>
                </div>
                <img
                  src={HeroImage}
                  alt="Education Ladder Concept"
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Wave SVG */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 200" className="wave-svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path 
            fill="url(#waveGradient)" 
            d="M0,160L60,160C120,160,240,160,360,138.7C480,117,600,75,720,80C840,85,960,139,1080,144C1200,149,1320,107,1380,85.3L1440,64L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z"
          />
        </svg>
      </div>

      {/* Enhanced Courses Section */}
      <div className="courses-section">
        <div className="container py-5">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p className="loading-text">Discovering amazing courses for you...</p>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="section-header text-center mb-5">
                <div className="section-badge">
                  <span className="badge bg-primary-gradient px-4 py-2 rounded-pill">
                    ✨ Featured Content
                  </span>
                </div>
                <h2 className="section-title">🎓 Trending Courses Just for You</h2>
                <p className="section-subtitle">
                  Hand-picked courses to accelerate your learning journey
                </p>
              </div>

              <div className="row justify-content-center g-4">
                {courses.map((course, index) => (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={course._id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div 
                      className="course-card"
                      onClick={() => handleCourseClick(course._id)}
                    >
                      <div className="course-image-container">
                        <img
                          src={course.image || course.courseThumbnail || "https://via.placeholder.com/300x180?text=No+Image"}
                          alt={course.title || course.courseTitle}
                          className="course-image"
                        />
                        <div className="course-overlay">
                          <div className="play-button">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="course-status-badge">
                          <span className={`status-badge ${course.status?.toLowerCase()}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="course-content">
                        <h6 className="course-title">
                          {course.title || course.courseTitle}
                        </h6>
                        <div className="course-meta">
                          <span className="course-level">
                            🎯 {course.level || course.courseLevel || "Beginner"}
                          </span>
                        </div>
                        <div className="course-stats">
                          <span className="stat-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration || "Self-paced"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="course-footer">
                        <button className="enroll-btn">
                          <span>View Course</span>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5">
                <button 
                  className="btn-view-all"
                  onClick={() => navigate("/courses")}
                >
                  <span>View All Courses</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="no-courses-container">
              <div className="no-courses-content">
                <div className="no-courses-icon">📚</div>
                <h3>No Courses Available</h3>
                <p>We're working hard to bring you amazing courses. Check back soon!</p>
                <button 
                  className="btn-refresh"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx="true">{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .min-vh-75 {
          min-height: 75vh;
        }

        .hero-text-content {
          z-index: 2;
          position: relative;
        }

        .welcome-badge {
          animation: slideInLeft 1s ease-out;
        }

        .hero-title {
          font-family: 'Gwendolyn', cursive;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          animation: slideInLeft 1s ease-out 0.2s both;
        }

        .highlight-name {
          background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 400;
          color: #e8f4f8;
        }

        .hero-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          line-height: 1.6;
          color: #e8f4f8;
          animation: slideInLeft 1s ease-out 0.4s both;
        }

        .hero-search-form {
          animation: slideInLeft 1s ease-out 0.6s both;
        }

        .search-container {
          display: flex;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          max-width: 600px;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          width: 20px;
          height: 20px;
          color: #666;
        }

        .search-input {
          width: 100%;
          border: none;
          outline: none;
          padding: 15px 20px 15px 50px;
          font-size: 1rem;
          background: transparent;
          font-family: 'Inter', sans-serif;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 40px;
          padding: 15px 30px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .search-btn svg {
          width: 16px;
          height: 16px;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          animation: slideInLeft 1s ease-out 0.8s both;
        }

        .btn-explore, .btn-learning {
          padding: 15px 30px;
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

        .btn-explore {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-explore:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .btn-learning {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #333;
        }

        .btn-learning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 154, 158, 0.4);
        }

        .hero-image-container {
          position: relative;
          animation: slideInRight 1s ease-out 0.3s both;
        }

        .hero-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
          animation: float 6s ease-in-out infinite;
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

        .wave-container {
          position: relative;
          margin-bottom: -1px;
        }

        .wave-svg {
          width: 100%;
          height: auto;
        }

        .courses-section {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          position: relative;
          z-index: 2;
        }

        .section-header .section-badge {
          margin-bottom: 1rem;
        }

        .bg-primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }

        .section-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .course-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: slideInUp 0.6s ease-out;
        }

        .course-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .course-image-container {
          position: relative;
          overflow: hidden;
          height: 200px;
        }
          @media (min-width: 992px) {
          .hero-content .row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        
            flex-wrap: nowrap; /* prevent wrapping */
          }
          .hero-content .col-lg-7 {
            order: 1;
            flex: 0 0 58.333333%;
            max-width: 58.333333%;
            
          }
          .hero-content .col-lg-5 {
            order: 2;
            flex: 0 0 41.666667%;
            max-width: 41.666667%;
            display: flex;
            justify-content: flex-end;
           
          }
        }

        .course-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .course-card:hover .course-image {
          transform: scale(1.1);
        }

        .course-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .course-card:hover .course-overlay {
          opacity: 1;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }

        .course-card:hover .play-button {
          transform: scale(1);
        }

        .play-button svg {
          width: 24px;
          height: 24px;
          margin-left: 4px;
        }

        .course-status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.free {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
        }

        .status-badge.paid {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
        }

        .course-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .course-title {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 12px;
          line-height: 1.4;
          flex: 1;
        }

        .course-meta {
          margin-bottom: 15px;
        }

        .course-level {
          font-size: 0.9rem;
          color: #667eea;
          font-weight: 500;
        }

        .course-stats {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .stat-item svg {
          width: 14px;
          height: 14px;
        }

        .course-footer {
          padding: 0 20px 20px;
        }

        .enroll-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
        }

        .enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .enroll-btn svg {
          width: 16px;
          height: 16px;
        }

        .btn-view-all {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 15px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
        }

        .btn-view-all:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }

        .btn-view-all svg {
          width: 20px;
          height: 20px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .loading-text {
          font-family: 'Inter', sans-serif;
          color: #64748b;
          font-size: 1.1rem;
        }

        .no-courses-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .no-courses-content {
          text-align: center;
          max-width: 400px;
        }

        .no-courses-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-courses-content h3 {
          font-family: 'Inter', sans-serif;
          color: #1a202c;
          margin-bottom: 15px;
        }

        .no-courses-content p {
          font-family: 'Inter', sans-serif;
          color: #64748b;
          margin-bottom: 25px;
        }

        .btn-refresh {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .btn-refresh:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .subtitle {
            font-size: 1.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .search-container {
            flex-direction: column;
            border-radius: 20px;
          }

          .search-btn {
            border-radius: 15px;
            margin-top: 10px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-explore, .btn-learning {
            justify-content: center;
          }

          .section-title {
            font-size: 2rem;
          }

          .float-element {
            font-size: 1.5rem;
          }

          .hero-image {
            max-width: 400px;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }

          .search-input {
            padding: 12px 15px 12px 45px;
          }

          .search-btn {
            padding: 12px 20px;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .course-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;