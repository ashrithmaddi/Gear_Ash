import React, { useState } from "react";
import axios from "axios";

function Register({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setSuccess("Registration successful! Please login.");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="card p-4 shadow" style={{ minWidth: 350 }}>
      <h2 className="mb-4 text-center" style={{ color: "#1a237e" }}>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        
      <div className="mb-3">
        <label>Role</label>
        <select
          className="form-control"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default Register