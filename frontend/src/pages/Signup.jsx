import React, { useState } from "react";
import axios from 'axios';
import "../css/welcome.css";

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (password.length < 8 || !/\d/.test(password)) {
      setError("Password must be at least 8 characters and include a number.");
      setLoading(false);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      setSuccess("Sign up successful! Redirecting to login...");
      setTimeout(() => window.location.href = "/login", 1700);
    } catch (e) {
      setError(e.response?.data?.error || "Sign up failed.");
    }
    setLoading(false);
  };

  return (
    <div className="welcome-main">
      <div className="welcome-box">
        <div className="welcome-logo">
          <i className="fas fa-wallet"></i>
        </div>
        <div className="welcome-title">Create Your Account</div>
        <div className="welcome-subtitle">Start managing your money smarter</div>
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1.65rem", width: "350px", maxWidth: "95vw", margin: "0 auto" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            required
            style={{ padding: "1.1rem", fontSize: "1.12rem", borderRadius: "11px", border: "1.2px solid #ccd7ef" }}
            autoFocus
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ padding: "1.1rem", fontSize: "1.12rem", borderRadius: "11px", border: "1.2px solid #ccd7ef" }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ padding: "1.1rem", fontSize: "1.12rem", borderRadius: "11px", border: "1.2px solid #ccd7ef" }}
          />
          <small style={{color: "var(--text-secondary)", marginBottom: "0.5rem", marginTop: "-1rem", textAlign:"left"}}>
            Password must be at least 8 characters and include a number.
          </small>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {error && <div style={{color:"#d32f2f",background:"#fde8e8",padding:"0.77rem",margin:"1rem 0",borderRadius:"9px",fontWeight:"600",textAlign:"center"}}>{error}</div>}
        {success && <div style={{color:"#08875d",background:"#e7faf0",padding:"0.77rem",margin:"1rem 0",borderRadius:"9px",fontWeight:"600",textAlign:"center"}}>{success}</div>}
        <div className="welcome-buttons" style={{marginTop: "1.5rem"}}>
          <button
            className="btn-secondary"
            onClick={() => window.location.href="/login"}
            style={{ textAlign: "center" }}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
