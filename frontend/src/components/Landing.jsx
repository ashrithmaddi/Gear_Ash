import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Landing() {
  const [showLogin, setShowLogin] = useState(true);


  return (
    <div
      className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{ background: "linear-gradient(to bottom, #1a237e, #0d47a1)" }}
    >
      <div>
        {showLogin ? (
          <div>
            <Login  setShowLogin={setShowLogin}/>
          </div>
        ) : (
          <div>
            <Register onSuccess={() => setShowLogin(true)} />
            <div className="text-center mt-3">
              <span style={{ color: "#fff" }}>Already have an account? </span>
              <button
                className="btn btn-link p-0"
                style={{ color: "#fff", textDecoration: "underline" }}
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;