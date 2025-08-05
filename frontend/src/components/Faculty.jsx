import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Faculty.css';
import { useNavigate } from 'react-router-dom';

function Faculty() {
  const [activeTab, setActiveTab] = useState('teacherList'); // State to track the active tab
  const [lecturers,setLecturers]=useState(0)
  const [active,setActive]=useState(0)
  const [lecturerList,setLecturerList]=useState([])
  const navigate=useNavigate()

  // Add state for registration form fields
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    experience: '',
    joiningDate: '',
    password: '',
    number: ''
  });
  const [formMsg, setFormMsg] = useState('');

  // Fetch lecturer list (for reuse)
  const fetchLecturerList = useCallback(async () => {
    try {
      let res = await axios.get("http://localhost:5000/api/admin/getLecturerList");
      setLecturerList(res.data.lecList);
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  // Fetch total and active lecturers
  const fetchCounts = useCallback(async () => {
    try {
      let res1 = await axios.get("http://localhost:5000/api/admin/getTotalLecturers");
      setLecturers(res1.data.lecturers);
      let res2 = await axios.get("http://localhost:5000/api/admin/getActiveLecturers");
      setActive(res2.data.active);
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    fetchLecturerList();
  }, [fetchCounts, fetchLecturerList]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg('');
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        role: "lecturer"
      };
      if (!payload.password) payload.password = 'lecturer@123';

      await axios.post('http://localhost:5000/api/auth/lecturerReg', payload);
      setFormMsg('Lecturer registered successfully!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        experience: '',
        joiningDate: '',
        password: '',
        number: ''
      });
      navigate("/faculty")
    } catch (err) {
      setFormMsg('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle lecturer status (Active/Inactive)
  const handleToggleStatus = async (lecturerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await axios.put(`http://localhost:5000/api/admin/updateLecturerStatus/${lecturerId}`, { status: newStatus });
      await fetchLecturerList();
      await fetchCounts();
    } catch (e) {
      console.log(e.message)
    }
  };

  // Render Teacher List
  const renderTeacherList = () => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Lecturer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Experience</th>
            <th>Joining Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lecturerList.map((lecturer) => (
            <tr key={lecturer._id}>
              <td>{lecturer._id}</td>
              <td>{lecturer.firstName} {lecturer.lastName}</td>
              <td>{lecturer.email}</td>
              <td>{lecturer.number}</td>
              <td>{lecturer.experience}</td>
              <td>{lecturer.joiningDate ? new Date(lecturer.joiningDate).toLocaleDateString() : ''}</td>
              <td>
                <span className={`badge ${lecturer.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                  {lecturer.status}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button
                    className={`btn btn-sm ${lecturer.status === 'Active' ? 'btn-danger' : 'btn-primary'} ms-2`}
                    onClick={() => handleToggleStatus(lecturer._id, lecturer.status)}
                  >
                    {lecturer.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Add New Teacher Form
  const renderAddTeacherForm = () => (
    <div>
      <h5>Add New Lecturer</h5>
      {formMsg && (
        <div className={`alert ${formMsg.startsWith('Lecturer registered') ? 'alert-success' : 'alert-danger'}`}>
          {formMsg}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="number"
              placeholder="Enter phone number"
              value={form.number}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Experience (Years)</label>
            <input
              type="number"
              className="form-control"
              name="experience"
              placeholder="Enter experience"
              value={form.experience}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
          <div className="col-md-6">
            <label>Joining Date</label>
            <input
              type="date"
              className="form-control"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Set password (default: lecturer@123)"
              value={form.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Lecturer
        </button>
      </form>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Main Content */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h6>Total Lecturers</h6>
              <h4>{lecturers}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h6>Active Lecturers</h6>
              <h4>{active}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teacherList' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacherList')}
          >
            <i className="bi bi-list"></i> Lecturer List
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'addTeacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('addTeacher')}
          >
            <i className="bi bi-person-plus"></i> Add New Lecturer
          </button>
        </li>
      </ul>

      {/* Conditional Rendering for Details Section */}
      <div>
        {activeTab === 'teacherList' && renderTeacherList()}
        {activeTab === 'addTeacher' && renderAddTeacherForm()}
      </div>
    </div>
  );
}

export default Faculty;