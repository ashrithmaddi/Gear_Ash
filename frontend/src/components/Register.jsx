import React, { useState } from "react";
import axios from "axios";
import config from "../config/config";

function Register({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post(config.getFullApiUrl("auth/register"), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess("Registration successful! Please login.");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="card p-4 shadow" style={{ minWidth: 350 }}>
      <h2 className="mb-4 text-center" style={{ color: "#1a237e" }}>
        Register
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Email */}
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

        {/* Password with Eye Toggle */}
        <div className="mb-3 position-relative">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "40px",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#555",
            }}
          ></i>
        </div>

        {/* Confirm Password with Eye Toggle */}
        <div className="mb-3 position-relative">
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-control"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <i
            className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "40px",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#555",
            }}
          ></i>
        </div>

        {/* Role */}
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
          </select>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
