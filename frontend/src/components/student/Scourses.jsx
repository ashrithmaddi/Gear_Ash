import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Scourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchQuery, selectedLevel, selectedStatus, sortBy]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/courses/every");
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(course => course.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "level":
          return a.level.localeCompare(b.level);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  const handleRefresh = () => {
    setIsError(false);
    fetchCourses();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedStatus("all");
    setSortBy("title");
  };

  // Get unique levels and statuses for filter options
  const levels = [...new Set(courses.map(course => course.level))];
  const statuses = [...new Set(courses.map(course => course.status))];

  if (isError) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't fetch the courses. Please try again.</p>
          <button className="btn-retry" onClick={handleRefresh}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
        
        <style jsx="true">{`
          .error-container {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          
          .error-content {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
          }
          
          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          
          .error-content h2 {
            color: #1a202c;
            margin-bottom: 1rem;
            font-family: 'Inter', sans-serif;
          }
          
          .error-content p {
            color: #64748b;
            margin-bottom: 2rem;
            font-size: 1.1rem;
          }
          
          .btn-retry {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }
          
          .btn-retry:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }
          
          .btn-retry svg {
            width: 18px;
            height: 18px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Hero Header */}
      <div className="courses-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge bg-light text-primary px-4 py-2 rounded-pill"  style={{ fontSize: "1.2rem" }}>
                🎓 Discover & Learn
              </span>
            </div>
            <h1 className="hero-title">Explore Our Courses</h1>
            <p className="hero-subtitle">
              Discover amazing courses designed to help you grow your skills and advance your career
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{courses.length}</span>
                <span className="stat-label">Total Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{levels.length}</span>
                <span className="stat-label">Skill Levels</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{courses.filter(c => c.status === 'Free').length}</span>
                <span className="stat-label">Free Courses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">Level:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="title">Title</option>
                  <option value="level">Level</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <button className="btn-clear-filters" onClick={clearFilters}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <span className="results-count">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
            {(searchQuery || selectedLevel !== 'all' || selectedStatus !== 'all') && (
              <span className="filter-indicator">
                Filters applied
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      <div className="courses-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="skeleton-card" key={index}>
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-footer">
                      <div className="skeleton-badge"></div>
                      <div className="skeleton-status"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No courses found</h3>
              <p>Try adjusting your search criteria or browse all courses</p>
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`courses-grid ${viewMode}`}>
              {filteredCourses.map((course, index) => (
                <div
                  className="course-card"
                  key={course._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link to={`/course-detail/${course._id}`} className="course-link">
                    <div className="course-image-container">
                      <img
                        src={course.image || "https://via.placeholder.com/400x240?text=No+Image"}
                        alt={course.title}
                        className="course-image"
                        loading="lazy"
                      />
                      <div className="course-overlay">
                        <div className="play-button">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="status-badge-container">
                        <span className={`status-badge ${course.status?.toLowerCase()}`}>
                          {course.status}
                        </span>
                      </div>
                    </div>

                    <div className="course-content">
                      <div className="course-header">
                        <h3 className="course-title">{course.title}</h3>
                        <div className="course-level">
                          <span className={`level-badge ${course.level?.toLowerCase()}`}>
                            {course.level}
                          </span>
                        </div>
                      </div>

                      <p className="course-description">
                        {course.description}
                      </p>

                      <div className="course-footer">
                        <div className="course-meta">
                          <span className="meta-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Self-paced
                          </span>
                          <span className="meta-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {Math.floor(Math.random() * 1000) + 100}+ students
                          </span>
                        </div>
                        
                        <div className="course-action">
                          <span className="action-text">
                            View Course
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx="true">{`
        .courses-page {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section */
        .courses-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4rem 0 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .courses-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .hero-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          margin-bottom: 1.5rem;
          animation: slideInDown 0.8s ease-out;
        }

        .hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .stats-container {
          display: flex;
          justify-content: center;
          gap: 3rem;
          animation: slideInUp 0.8s ease-out 0.6s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Filters Section */
        .filters-section {
          padding: 2rem 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 70px;
          z-index: 100;
          box-shadow: 0 2px 10px  rgba(118, 75, 162, 0.9);
        }

        .filters-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          width: 20px;
          height: 20px;
          color: #64748b;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 45px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          
        }

        .clear-search {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          color: #d8d8d8ff;
          transition: color 0.3s ease;
        }

        .clear-search:hover {
          color: #e2e5eaff;
        }

        .clear-search svg {
          width: 16px;
          height: 16px;
        }

        .filter-controls {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #756cc9ff;
          white-space: nowrap;
        }

        .filter-select {
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-clear-filters {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          color: #64748b;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .btn-clear-filters:hover {
          background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
          color: #334155;
          transform: translateY(-1px);
        }

        .btn-clear-filters svg {
          width: 14px;
          height: 14px;
        }

        .view-toggle {
          display: flex;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .view-btn {
          background: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn svg {
          width: 18px;
          height: 18px;
          color: #64748b;
        }

        .view-btn.active {
          background: #667eea;
        }

        .view-btn.active svg {
          color: white;
        }

        .view-btn:hover:not(.active) {
          background: #f1f5f9;
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .results-count {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
        }

        .filter-indicator {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Courses Content */
        .courses-content {
          padding: 3rem 0;
        }

        .courses-grid {
          display: grid;
          gap: 2rem;
        }

        .courses-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .courses-grid.list {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .course-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInUp 0.6s ease-out;
          height: fit-content;
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .course-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .course-image-container {
          position: relative;
          overflow: hidden;
          height: 200px;
        }

        .courses-grid.list .course-card {
          display: flex;
          align-items: stretch;
        }

        .courses-grid.list .course-image-container {
          width: 300px;
          height: auto;
          min-height: 200px;
        }

        .courses-grid.list .course-content {
          flex: 1;
        }

        .course-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .course-card:hover .course-image {
          transform: scale(1.05);
        }

        .course-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
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

        .status-badge-container {
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
          backdrop-filter: blur(10px);
        }

        .status-badge.free {
          background: rgba(72, 187, 120, 0.9);
          color: white;
        }

        .status-badge.paid {
          background: rgba(237, 137, 54, 0.9);
          color: white;
        }

        .course-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .course-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          line-height: 1.4;
          flex: 1;
          font-family: 'Poppins', sans-serif;
        }

        .course-level {
          flex-shrink: 0;
        }

        .level-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .level-badge.beginner {
          background: #e0f7fa;
          color: #00695c;
        }

        .level-badge.intermediate {
          background: #fff3e0;
          color: #ef6c00;
        }

        .level-badge.advanced {
          background: #fce4ec;
          color: #c2185b;
        }

        .course-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .course-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .meta-item svg {
          width: 14px;
          height: 14px;
        }

        .course-action {
          flex-shrink: 0;
        }

        .action-text {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .course-card:hover .action-text {
          color: #764ba2;
          transform: translateX(4px);
        }

        .action-text svg {
          width: 14px;
          height: 14px;
          transition: transform 0.3s ease;
        }

        .course-card:hover .action-text svg {
          transform: translateX(2px);
        }

        /* Loading Skeletons */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .skeleton-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: pulse 2s infinite;
        }

        .skeleton-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .skeleton-content {
          padding: 1.5rem;
        }

        .skeleton-title {
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-text.short {
          width: 70%;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .skeleton-badge {
          height: 20px;
          width: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 10px;
        }

        .skeleton-status {
          height: 16px;
          width: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 4px;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .no-results h3 {
          color: #1a202c;
          margin-bottom: 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .no-results p {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        /* Animations */
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .stats-container {
            gap: 2rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .filters-container {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .search-container {
            min-width: auto;
          }

          .filter-controls {
            justify-content: space-between;
            gap: 1rem;
          }

          .filter-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .results-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .courses-grid.grid {
            grid-template-columns: 1fr;
          }

          .courses-grid.list .course-card {
            flex-direction: column;
          }

          .courses-grid.list .course-image-container {
            width: 100%;
            height: 200px;
          }

          .course-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .course-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .course-meta {
            gap: 0.5rem;
          }

          .loading-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .stats-container {
            flex-direction: column;
            gap: 1.5rem;
          }

          .courses-content {
            padding: 2rem 0;
          }

          .course-content {
            padding: 1rem;
          }

          .course-title {
            font-size: 1.1rem;
          }

          .course-description {
            font-size: 0.9rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .courses-page {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            color: white;
          }

          .course-card {
            background: #2d3748;
            border-color: #4a5568;
          }

          .course-title {
            color: white;
          }

          .course-description {
            color: #a0aec0;
          }

          .search-input {
            background: #eaedf3ff;
            border-color: #b0b5bfff;
            color: white;
          }

          .filter-select {
            background: #2d3748;
            border-color: #4a5568;
            color: white;
          }

            .filters-section {
            padding: 2rem 0;
            background: transparent; /* removes any background */
            border-bottom: none;     /* removes border */
            box-shadow: none;        /* removes shadow */
            color: white;            /* makes text white */
          }


        }

        /* Print styles */
        @media print {
          .filters-section {
            display: none;
          }

          .course-card {
            break-inside: avoid;
            box-shadow: none;
            border: 1px solid #e2e8f0;
          }

          .course-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Scourses;