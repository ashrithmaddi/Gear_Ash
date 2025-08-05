import React, { useState, useEffect } from 'react';
import './Students.css';
import axios from 'axios';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [performanceSearch, setPerformanceSearch] = useState('');

  useEffect(() => {
    const fetchStatsAndList = async () => {
      try {
        const [
          totalRes,
          activeRes,
          newMonthRes,
          pendingRes,
          listRes,
          attendanceRes,
          testResultsRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/getTotalStudents'),
          axios.get('http://localhost:5000/api/admin/getActiveStudents'),
          axios.get('http://localhost:5000/api/admin/getNewStudentsThisMonth'),
          axios.get('http://localhost:5000/api/admin/getPendingFees'),
          axios.get('http://localhost:5000/api/admin/getStudentList'),
          axios.get('http://localhost:5000/api/admin/getAttendanceData'),
          axios.get('http://localhost:5000/api/admin/getTestResults')
        ]);
        setTotalStudents(totalRes.data.students || 0);
        setActiveStudents(activeRes.data.active || 0);
        setNewThisMonth(newMonthRes.data.newThisMonth || 0);
        setPendingFees(pendingRes.data.pendingFees || 0);
        setStudents(listRes.data.studentList || []);
        setAttendanceData(attendanceRes.data.attendance || []);
        setTestResults(testResultsRes.data.testResults || []);
      } catch (err) {
        setError('Failed to connect to the server. Please ensure the backend is running.');
      }
    };
    fetchStatsAndList();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    (student.firstName + ' ' + student.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student._id && student._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtered attendance and test results for search
  const filteredAttendance = attendanceData.filter(record =>
    (record.subject?.toLowerCase() || '').includes(attendanceSearch.toLowerCase()) ||
    (record.status?.toLowerCase() || '').includes(attendanceSearch.toLowerCase()) ||
    (record.remarks?.toLowerCase() || '').includes(attendanceSearch.toLowerCase())
  );

  const filteredTestResults = testResults.filter(result =>
    (result.subject?.toLowerCase() || '').includes(performanceSearch.toLowerCase()) ||
    (result.remarks?.toLowerCase() || '').includes(performanceSearch.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStudents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDeleteStudent = async (studentId) => {
  if (!window.confirm('Are you sure you want to delete this student?')) return;
  try {
    await axios.delete(`http://localhost:5000/api/students/${studentId}`);   
     setStudents(prev => prev.filter(s => s._id !== studentId));
  } catch (err) {
    alert('Failed to delete student.');
  }
};

  
  // Render Academic Details Section
  const renderAcademicDetails = () => (
    <div>
      {/* Attendance Summary */}
      <div className="mb-4">
        <h5>Attendance Summary</h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="entries">
            Show 
            <select 
              className="form-select form-select-sm d-inline-block mx-2" 
              style={{ width: '70px' }}
              // Optionally, you can implement pagination for attendance
              disabled
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <div className="search">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search attendance..."
              value={attendanceSearch}
              onChange={(e) => setAttendanceSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date <i className="bi bi-arrow-down-up"></i></th>
                <th>Subject <i className="bi bi-arrow-down-up"></i></th>
                <th>Status <i className="bi bi-arrow-down-up"></i></th>
                <th>Remarks <i className="bi bi-arrow-down-up"></i></th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">No attendance records found.</td>
                </tr>
              ) : (
                filteredAttendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : ''}</td>
                    <td>{record.subject}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Optionally implement pagination for attendance if needed */}
      </div>

      {/* Test Results */}
      <div>
        <h5>Test Results</h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="entries">
            Show 
            <select 
              className="form-select form-select-sm d-inline-block mx-2" 
              style={{ width: '70px' }}
              disabled
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <div className="search">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search performance..."
              value={performanceSearch}
              onChange={(e) => setPerformanceSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Test Date <i className="bi bi-arrow-down-up"></i></th>
                <th>Subject <i className="bi bi-arrow-down-up"></i></th>
                <th>Score <i className="bi bi-arrow-down-up"></i></th>
                <th>Rank <i className="bi bi-arrow-down-up"></i></th>
                <th>Remarks <i className="bi bi-arrow-down-up"></i></th>
              </tr>
            </thead>
            <tbody>
              {filteredTestResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">No test results found.</td>
                </tr>
              ) : (
                filteredTestResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.date ? new Date(result.date).toLocaleDateString() : ''}</td>
                    <td>{result.subject}</td>
                    <td>{result.score}</td>
                    <td>{result.rank}</td>
                    <td>{result.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Optionally implement pagination for test results if needed */}
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row mb-5 mt-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-people-fill text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0">Total Students</h6>
                  <h4 className="mb-0">{totalStudents}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-person-check-fill text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0">Active Students</h6>
                  <h4 className="mb-0">{activeStudents}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-person-plus-fill text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0">New This Month</h6>
                  <h4 className="mb-0">{newThisMonth}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="icon-container bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-currency-dollar text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0">Pending Fees</h6>
                  <h4 className="mb-0">{pendingFees}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'basic-info' ? 'active' : ''}`}
                href="#basic-info"
                onClick={e => {
                  e.preventDefault();
                  setActiveTab('basic-info');
                }}
              >
                <i className="bi bi-person me-2"></i>
                Basic Information
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === 'academic-details' ? 'active' : ''}`} 
                href="#academic-details"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('academic-details');
                }}
              >
                <i className="bi bi-mortarboard me-2"></i>
                Academic Details
              </a>
            </li>
          </ul>

          {activeTab === 'basic-info' ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="entries">
                  Show
                  <select
                    className="form-select form-select-sm d-inline-block mx-2"
                    style={{ width: '70px' }}
                    value={entriesPerPage}
                    onChange={e => setEntriesPerPage(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  entries
                </div>
                <div className="search">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map(student => (
                      <tr key={student._id}>
                        <td>
                          {student._id
                            ? `${student._id.slice(0, 4)}${student._id.slice(-4)}`
                            : ''}
                        </td>
                        <td>{student.firstName} {student.lastName}</td>
                        <td>{student.email}</td>
                        <td>
                          <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                      
                            <button className="btn btn-sm btn-danger"  onClick={() => handleDeleteStudent(student._id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredStudents.length)} of {filteredStudents.length} entries
                </div>
                <div className="pagination">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button className="btn btn-primary me-2">
                    {currentPage}
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            renderAcademicDetails()
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;