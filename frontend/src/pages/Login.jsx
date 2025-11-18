import React, { useState } from "react";
import axios from "axios";
import "../css/welcome.css"; // Use welcome.css for styles

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      window.location.href = "/home";
    } catch (e) {
      setError(e.response?.data?.error || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="welcome-main">
      <div className="welcome-box">
        <div className="welcome-title">Login to Aureus Flow</div>
        <div className="welcome-subtitle">Sign in to your account</div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.65rem", width: "350px", maxWidth: "95vw", margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: "1.1rem", fontSize: "1.12rem", borderRadius: "11px", border: "1.2px solid #ccd7ef" }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: "1.1rem", fontSize: "1.12rem", borderRadius: "11px", border: "1.2px solid #ccd7ef" }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <div style={{color:"#d32f2f",background:"#fde8e8",padding:"0.77rem",margin:"1rem 0",borderRadius:"9px",fontWeight:"600",textAlign:"center"}}>{error}</div>}
        <div className="welcome-buttons" style={{marginTop: "1.5rem"}}>
          <button
            className="btn-secondary"
            onClick={() => window.location.href="/signup"}
            style={{ textAlign: "center" }}
          >
            Don’t have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
