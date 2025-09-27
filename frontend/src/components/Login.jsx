import React, { useState, useContext } from "react";
import axios from "axios";
import { userAdminContextObj } from "../context/UserAdmin";
import { useNavigate } from "react-router-dom";
import config from "../config/config";
import "./Login.css";

function Login({ setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  let { currentUser, setCurrentUser } = useContext(userAdminContextObj);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await axios.post(config.getFullApiUrl("auth/login"), { 
        email, 
        password, 
        role: role === "user" ? "user" : "admin" 
      });
      
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      setCurrentUser(res.data);
      
      if (res.data.role === "admin") {
        navigate("/dash");
      } else {
        navigate("/studash");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-box login">
        <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>
          Login
        </h2>

        {error && <div className="error-message animation" style={{ "--i": 18, "--j": 0 }}>
          {error}
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label htmlFor="">Email</label>
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box animation" style={{ "--i": 19, "--j": 2 }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label htmlFor="">Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="role-select"
            >
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="">Role</label>
            <i className="bx bxs-user"></i>
          </div>

          <button 
            type="submit" 
            className="btn animation" 
            style={{ "--i": 21, "--j": 4 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-link animation" style={{ "--i": 22, "--j": 5 }}>
          <p>
            New Student?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;