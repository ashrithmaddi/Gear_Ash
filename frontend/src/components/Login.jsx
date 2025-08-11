import React, { useState,useContext} from "react";
import axios from "axios";
import { userAdminContextObj } from "../context/UserAdmin";
import { useNavigate } from "react-router-dom";

function Login({setShowLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("student");
  let {currentUser,setCurrentUser}=useContext(userAdminContextObj)
  const navigate=useNavigate()

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password, role: type });
    localStorage.setItem("currentUser", JSON.stringify(res.data));
    setCurrentUser(res.data);
    if (res.data.role === "admin") {
      navigate("/dash");
    } else {
      navigate("/studash");
    }
  } catch (err) {
    setError(err.response?.data?.error);
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to bottom, #1a237e, #0d47a1)" ,minHeight:"100vh"}}>
      <div className="card p-4 shadow" style={{ minWidth: 350 }}>
        <h2 className="mb-4 text-center" style={{ color: "#1a237e" }}>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select
              className="form-control"
              value={type}
              onChange={e => setType(e.target.value)}
              required
            >
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
            <span style={{ color: "black" }}>New Student? </span>
            <button
              className="btn p-0"
              style={{ color: "black", background: "none", border: "none", textDecoration: "underline" }}
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
        </div>
      </div>
      
    </div>
  );
}

export default Login;